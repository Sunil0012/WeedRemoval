# 🌱 Fully Autonomous Weed Removal Rover/Robot
### Precision Agriculture | Robotics | Edge Deployment

---

## 📌 Project Overview

The **AI-Based Fully Autonomous Weed Removal Rover** is an interdisciplinary robotics project designed to provide an eco-friendly, cost-effective, and intelligent solution for weed management in agriculture.

Weeds reduce crop productivity by competing for water, nutrients, and sunlight. Manual weeding is labor-intensive and expensive, while chemical herbicides damage soil and the environment.

This project builds a fully autonomous rover that:

- Detects weeds using Deep Learning (YOLOv11)
- Navigates crop rows autonomously
- Removes weeds mechanically
- Runs AI models in real-time on edge devices (Jetson Nano)

---

## 🎯 Problem Statement

Traditional weed control methods have major limitations:

- ❌ Manual weeding → Labor-intensive and costly  
- ❌ Herbicides → Environmental damage and soil degradation  
- ❌ Basic automation → Lacks intelligence and precision  

We propose an **AI-powered autonomous rover** capable of detecting and removing weeds with minimal crop disturbance.

---

## 🧠 System Architecture

The system follows a complete AI + Robotics pipeline:

Data Collection → Annotation → Model Training → Deployment →
Detection → Decision Making → Tool Actuation


### Core Modules

1. **Data Collection & Annotation**
   - Field image/video capture
   - Bounding boxes (YOLO format)
   - Optional segmentation masks

2. **AI Weed Detection**
   - YOLOv11 object detection
   - Transfer learning
   - Data augmentation
   - Evaluation using mAP, Precision, Recall

3. **Precision Localization (Advanced)**
   - YOLOv11-Seg / DeepLabV3+
   - Weed centroid calculation
   - Accurate tool alignment

4. **Autonomous Navigation**
   - Ultrasonic / IR sensors
   - Obstacle detection
   - Vision-based crop row guidance

5. **Decision & Actuation**
   - Confidence threshold checking
   - Weed centroid computation
   - Trigger mechanical cutter/gripper
   - Crop avoidance logic

6. **Edge Deployment**
   - Jetson Nano inference
   - ONNX export
   - FP16 / INT8 quantization

---

## 📂 Dataset Details

### Public Dataset
- DeepWeeds
- Other open-source crop/weed datasets

### Custom Dataset
- Locally collected field images
- Multiple lighting conditions
- Different crop growth stages
- Various weed densities

### Data Augmentation
- Rotation
- Flipping
- Brightness/contrast shifts
- Scaling

### Annotation Format
- YOLO bounding box format
- Optional segmentation masks

---

## 🛠 Hardware Components

- NVIDIA Jetson Nano
- USB / CSI Camera Module
- Rover chassis
- Motor driver (L298N / Cytron)
- DC Gear Motors
- Servo motors
- Ultrasonic Sensors
- IR Sensors
- Battery pack
- Weed removal mechanism (cutter / gripper)

---

## 💻 Software Stack

- Python
- OpenCV
- PyTorch / TensorFlow
- Ultralytics YOLO
- Arduino IDE
- ONNX Runtime

---

## 🔧 Tools Used

- LabelImg / Roboflow (Annotation)
- GitHub (Version control)
- CAD Software (Mechanical design)
- 3D Printing / Fabrication tools

---

## 🚀 Novelty of the Project

This system integrates:

- ✅ Real-time AI detection on edge device  
- ✅ Precision segmentation-based targeting  
- ✅ Autonomous navigation with obstacle avoidance  
- ✅ Mechanical weed removal linked directly to AI output  

Unlike basic lab prototypes, this system is designed for **real-field agricultural automation**.

---


## 📅 Project Timeline (16 Weeks)

| Phase | Duration | Tasks |
|-------|----------|-------|
| Week 1 | Literature Survey | Problem Understanding |
| Weeks 2–3 | Architecture & Design | Hardware selection & mechanical planning |
| Weeks 4–6 | Dataset & Training | YOLO model training |
| Weeks 7–8 | Advanced Precision | Segmentation module |
| Weeks 9–10 | Rover Assembly | Motors, sensors, obstacle avoidance |
| Weeks 11–13 | AI Deployment | Jetson integration & actuation |
| Weeks 14–16 | Testing & Demo | Field testing, tuning, documentation |

---

## 📊 Expected Outcomes

- Fully functional autonomous rover prototype
- AI Detection Performance:
  - mAP ≥ 0.75
  - High precision to minimize crop damage
- Real-time weed detection & removal demonstration
- Complete project deliverables:
  - Source Code
  - Trained Model
  - Documentation
  - Demo Video

---
