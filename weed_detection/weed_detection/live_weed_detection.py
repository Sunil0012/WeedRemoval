import cv2
import numpy as np
from ultralytics import YOLO
import pyrealsense2 as rs
import time
try:
    import open3d as o3d
    HAS_OPEN3D = True
except ImportError:
    print("Warning: open3d not installed. 3D visualization will be limited.")
    print("Install with: pip install open3d")
    HAS_OPEN3D = False

# Load the trained YOLO model
model = YOLO("./runs/detect/train2/weights/best.pt")

# Configure Intel RealSense D435i
pipeline = rs.pipeline()
config = rs.config()

# Get device info
ctx = rs.context()
devices = ctx.query_devices()

print(f"Detected {len(devices)} RealSense device(s)")

if len(devices) == 0:
    print("ERROR: No RealSense device detected!")
    print("Please check:")
    print("  1. Camera is plugged in via USB 3.0")
    print("  2. Drivers are installed")
    print("  3. No other application is using the camera")
    exit()

# Print device info
for i, device in enumerate(devices):
    print(f"Device {i}: {device.get_info(rs.camera_info.name)}")
    print(f"  Serial: {device.get_info(rs.camera_info.serial_number)}")

try:
    # Configure streams
    config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
    config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
    config.enable_stream(rs.stream.infrared, 1, 640, 480, rs.format.y8, 30)  # Thermal stream

    print("Starting RealSense pipeline...")
    # Start pipeline with timeout
    profile = pipeline.start(config)
    
    print("Pipeline started successfully!")
    
    # Get depth scale for depth map
    depth_sensor = profile.get_device().first_depth_sensor()
    depth_scale = depth_sensor.get_depth_scale()
    print(f"Depth scale: {depth_scale}")
    
    # Get camera intrinsics for 3D reconstruction
    color_profile = profile.get_stream(rs.stream.color)
    intrinsics = color_profile.as_video_stream_profile().get_intrinsics()

    # Create alignment object
    align_to = rs.stream.color
    align = rs.align(align_to)
    
    # Warm up the camera (get a few frames)
    print("Warming up camera...")
    for _ in range(5):
        pipeline.wait_for_frames()
    print("Camera ready!")
    print("Controls:")
    print("  't' = Toggle RGB/Thermal/3D modes")
    print("  'q' = Exit")
    if HAS_OPEN3D:
        print("  (In 3D mode: rotate with mouse, zoom with scroll)")
    else:
        print("  (Install open3d for 3D visualization: pip install open3d)")
    
except Exception as e:
    print(f"ERROR: Failed to start pipeline: {e}")
    print("Possible causes:")
    print("  1. Camera firmware needs update")
    print("  2. USB power insufficient (use USB 3.0)")
    print("  3. Camera is already in use by another application")
    exit()

# Confidence threshold
conf_threshold = 0.5

# View mode: 'rgb', 'thermal', or '3d'
view_mode = 'rgb'

# For 3D visualization
pc = None
visualizer = None

def depth_to_pointcloud(depth_frame, color_frame, intrinsics, depth_scale):
    """Convert depth frame to point cloud"""
    depth_image = np.asanyarray(depth_frame.get_data())
    color_image = np.asanyarray(color_frame.get_data())
    
    # Convert depth to meters
    depth_in_meters = depth_image * depth_scale
    
    # Create point cloud
    h, w = depth_image.shape
    x, y = np.meshgrid(np.arange(w), np.arange(h))
    
    # Unproject using camera intrinsics
    X = (x - intrinsics.ppx) * depth_in_meters / intrinsics.fx
    Y = (y - intrinsics.ppy) * depth_in_meters / intrinsics.fy
    Z = depth_in_meters
    
    # Stack and reshape
    points = np.dstack([X, Y, Z]).reshape(-1, 3)
    colors = color_image.reshape(-1, 3) / 255.0
    
    # Filter invalid points (depth = 0)
    valid = (depth_image.flatten() > 0) & (depth_in_meters.flatten() < 5.0)  # Max 5 meters
    points = points[valid]
    colors = colors[valid]
    
    return points, colors

print("Starting live weed detection with Intel RealSense D435i... Press 'q' to exit")

frame_count = 0
start_time = time.time()

while True:
    # Get frames from RealSense
    frames = pipeline.wait_for_frames()
    
    # Align depth frame to color frame
    aligned_frames = align.process(frames)
    
    color_frame = aligned_frames.get_color_frame()
    depth_frame = aligned_frames.get_depth_frame()
    ir_frame = frames.get_infrared_frame(1)  # Get thermal/IR frame
    
    if not color_frame or not depth_frame:
        continue
    
    # Convert images to numpy arrays
    color_image = np.asanyarray(color_frame.get_data())
    depth_image = np.asanyarray(depth_frame.get_data())
    ir_image = np.asanyarray(ir_frame.get_data())
    
    # Choose which frame to process based on view mode
    if view_mode == 'rgb':
        frame = color_image
        display_frame = color_image.copy()
    elif view_mode == 'thermal':  # thermal mode
        # Convert thermal IR to 3-channel for visualization
        ir_normalized = cv2.normalize(ir_image, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        frame = cv2.cvtColor(ir_normalized, cv2.COLOR_GRAY2BGR)  # For YOLO detection
        # Apply colormap for thermal visualization
        display_frame = cv2.applyColorMap(ir_normalized, cv2.COLORMAP_JET)
    else:  # 3D mode
        # Use color image for detection, generate point cloud
        frame = color_image
        if HAS_OPEN3D:
            points, colors = depth_to_pointcloud(depth_frame, color_frame, intrinsics, depth_scale)
            if len(points) > 0:
                pcd = o3d.geometry.PointCloud()
                pcd.points = o3d.utility.Vector3dVector(points)
                pcd.colors = o3d.utility.Vector3dVector(colors)
                pc = pcd
    
    # Run inference on the frame
    results = model(frame, conf=conf_threshold, verbose=False)
    
    # Get the annotated frame
    annotated_frame = results[0].plot()
    
    # Use display_frame if thermal mode (overlay annotations on thermal)
    if view_mode == 'thermal':
        # Resize annotated frame to match display frame if needed
        h_display, w_display = display_frame.shape[:2]
        h_anno, w_anno = annotated_frame.shape[:2]
        if h_display != h_anno or w_display != w_anno:
            annotated_frame = cv2.resize(annotated_frame, (w_display, h_display))
        # Blend thermal image with detections
        annotated_frame = cv2.addWeighted(display_frame, 0.6, annotated_frame, 0.4, 0)
    
    # Get detection info
    detections = results[0].boxes
    
    # Display info on frame
    info_text = f"Detections: {len(detections)}"
    cv2.putText(annotated_frame, info_text, (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    # Count weeds and crops
    weed_count = 0
    crop_count = 0
    
    for detection in detections:
        class_id = int(detection.cls)
        class_name = model.names[class_id]
        
        if class_name == "Weed":
            weed_count += 1
        elif class_name == "Crop":
            crop_count += 1
    
    # Display counts
    count_text = f"Weeds: {weed_count} | Crops: {crop_count}"
    cv2.putText(annotated_frame, count_text, (10, 70), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    
    # Display FPS
    frame_count += 1
    elapsed = time.time() - start_time
    fps = frame_count / elapsed if elapsed > 0 else 0
    fps_text = f"FPS: {fps:.1f}"
    cv2.putText(annotated_frame, fps_text, (10, 110), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)
    
    # Display mode indicator
    mode_text = f"Mode: {view_mode.upper()}"
    if view_mode == 'rgb':
        color = (0, 255, 0)  # Green for RGB
    elif view_mode == 'thermal':
        color = (0, 165, 255)  # Orange for Thermal
    else:
        color = (255, 0, 0)  # Blue for 3D
    
    cv2.putText(annotated_frame, mode_text, (10, 190), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    
    # Show frame based on mode
    if view_mode == '3d' and HAS_OPEN3D and pc is not None:
        # Display 3D point cloud
        if visualizer is None:
            visualizer = o3d.visualization.Visualizer()
            visualizer.create_window("3D Weed Detection - Point Cloud", width=800, height=600)
            visualizer.add_geometry(pc)
            visualizer.get_render_option().point_size = 2.0
        else:
            visualizer.clear_geometries()
            visualizer.add_geometry(pc)
        
        visualizer.poll_events()
        visualizer.update_renderer()
    else:
        # Display 2D view
        cv2.imshow("Live Weed Detection", annotated_frame)
    
    # Press 'q' to exit, 't' to toggle modes
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('t'):
        if view_mode == 'rgb':
            view_mode = 'thermal'
        elif view_mode == 'thermal':
            view_mode = '3d' if HAS_OPEN3D else 'rgb'
        else:
            view_mode = 'rgb'
        print(f"Switched to {view_mode.upper()} mode")

# Release resources
if visualizer is not None:
    visualizer.destroy_window()
pipeline.stop()
cv2.destroyAllWindows()
print("Detection stopped")
