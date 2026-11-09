// scripts/seed.js
// Database seed script for GroupProject Hub.
// Generates a realistic student group project workspace with:
// - 1 Demo Project
// - 4 Team Members
// - 12 Tasks (distributed among statuses, including overdue tasks)
// - 3 Meeting Notes with attendees
// - 4 Milestones
//
// Run using: npm run seed (from /server directory)

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import all models
const Project = require('../models/Project');
const Member = require('../models/Member');
const Task = require('../models/Task');
const MeetingNote = require('../models/MeetingNote');
const Milestone = require('../models/Milestone');

async function seed() {
  console.log('🌱 Starting GroupProject Hub seed process...');

  // Connect to MongoDB
  await connectDB();

  try {
    // 1. Wipe existing demo project if already seeded
    const existing = await Project.findOne({ name: 'Autonomous Drone Navigation (CS490)' });
    if (existing) {
      console.log('🧹 Cleaning up previously seeded project data...');
      await Promise.all([
        Member.deleteMany({ project: existing._id }),
        Task.deleteMany({ project: existing._id }),
        MeetingNote.deleteMany({ project: existing._id }),
        Milestone.deleteMany({ project: existing._id }),
        Project.findByIdAndDelete(existing._id),
      ]);
    }

    // 2. Create Demo Project
    console.log('📁 Creating project workspace...');
    const project = await Project.create({
      name: 'Autonomous Drone Navigation (CS490)',
      description:
        'Capstone Senior Design Project: Real-time obstacle avoidance and path planning using ROS2 and computer vision algorithms on an embedded NVIDIA Jetson platform.',
    });

    // 3. Create 4 Team Members
    console.log('👥 Creating 4 team members...');
    const members = await Member.create([
      {
        project: project._id,
        name: 'Alex Rivera',
        email: 'alex.rivera@student.univ.edu',
      },
      {
        project: project._id,
        name: 'Samantha Chen',
        email: 'samantha.chen@student.univ.edu',
      },
      {
        project: project._id,
        name: 'Marcus Brody',
        email: 'marcus.brody@student.univ.edu',
      },
      {
        project: project._id,
        name: 'Priya Sharma',
        email: 'priya.sharma@student.univ.edu',
      },
    ]);

    const [alex, samantha, marcus, priya] = members;

    // Helper dates
    const now = new Date();
    const daysFromNow = (days) => {
      const d = new Date();
      d.setDate(now.getDate() + days);
      return d;
    };

    // 4. Create 12 Tasks (mix of completed, in progress, to do, and overdue)
    console.log('📋 Creating 12 tasks with varied priorities, assignees, and deadlines...');
    await Task.create([
      // Completed Tasks
      {
        project: project._id,
        title: 'Hardware Procurement & Component Unboxing',
        description: 'Verify motors, flight controller, LIDAR sensors, and Jetson board specifications.',
        assignedTo: marcus._id,
        dueDate: daysFromNow(-14),
        status: 'Done',
        priority: 'High',
      },
      {
        project: project._id,
        title: 'Set up Git Repository & ROS2 Docker Workspace',
        description: 'Initialize common dev environment Dockerfile with Ubuntu 22.04 and Humble Hawksbill.',
        assignedTo: alex._id,
        dueDate: daysFromNow(-10),
        status: 'Done',
        priority: 'Medium',
      },
      {
        project: project._id,
        title: 'Project Architecture Proposal Document',
        description: 'Draft software block diagram, interface specs, and submit to course advisor.',
        assignedTo: samantha._id,
        dueDate: daysFromNow(-8),
        status: 'Done',
        priority: 'High',
      },

      // Overdue Tasks (dueDate < today AND status != Done)
      {
        project: project._id,
        title: 'LIDAR Sensor Driver Integration Benchmark',
        description: 'Resolve high latency in point-cloud callback pipeline under heavy load.',
        assignedTo: marcus._id,
        dueDate: daysFromNow(-4),
        status: 'In Progress',
        priority: 'High',
      },
      {
        project: project._id,
        title: 'Submit Midterm Budget Expense Receipts',
        description: 'Consolidate sensor invoices and submit department reimbursement form.',
        assignedTo: alex._id,
        dueDate: daysFromNow(-2),
        status: 'To Do',
        priority: 'Medium',
      },

      // In Progress Tasks (Upcoming)
      {
        project: project._id,
        title: 'Obstacle Detection Neural Net Optimization',
        description: 'Quantize YOLOv8 model with TensorRT for real-time 30 FPS inference on Jetson.',
        assignedTo: samantha._id,
        dueDate: daysFromNow(4),
        status: 'In Progress',
        priority: 'High',
      },
      {
        project: project._id,
        title: 'A* Path Planning Global Planner Node',
        description: 'Implement grid-based global planner avoiding detected bounding boxes.',
        assignedTo: priya._id,
        dueDate: daysFromNow(7),
        status: 'In Progress',
        priority: 'High',
      },

      // To Do Tasks (Upcoming)
      {
        project: project._id,
        title: 'Gazebo Simulation Environment Setup',
        description: 'Build virtual warehouse 3D environment for headless drone navigation testing.',
        assignedTo: priya._id,
        dueDate: daysFromNow(12),
        status: 'To Do',
        priority: 'Medium',
      },
      {
        project: project._id,
        title: 'Emergency Failsafe Flight Controller Script',
        description: 'Implement auto-hover and return-to-home protocol on signal loss.',
        assignedTo: marcus._id,
        dueDate: daysFromNow(15),
        status: 'To Do',
        priority: 'High',
      },
      {
        project: project._id,
        title: 'Prepare Midterm Demo Slides',
        description: 'Compile system diagram, preliminary test videos, and Gantt chart review.',
        assignedTo: alex._id,
        dueDate: daysFromNow(18),
        status: 'To Do',
        priority: 'Medium',
      },

      // Unassigned Tasks (Demonstrates unassigned bucket)
      {
        project: project._id,
        title: 'Peer Review Rubric Evaluation Form',
        description: 'Coordinate peer review questionnaire with collaborating senior teams.',
        assignedTo: null,
        dueDate: daysFromNow(6),
        status: 'To Do',
        priority: 'Low',
      },
      {
        project: project._id,
        title: 'Order Backup LiPo Batteries & Propellers',
        description: 'Ensure lab inventory has spare 4S 5000mAh packs for outdoor test trials.',
        assignedTo: null,
        dueDate: daysFromNow(-1), // Unassigned and overdue!
        status: 'To Do',
        priority: 'Medium',
      },
    ]);

    // 5. Create 3 Meeting Notes
    console.log('📝 Creating 3 meeting notes with attendance...');
    await MeetingNote.create([
      {
        project: project._id,
        title: 'Project Kickoff & Role Assignments',
        date: daysFromNow(-16),
        content:
          'Discussed project requirements, rubric, and deliverables. Alex will handle simulation and systems integration. Samantha leads computer vision. Marcus handles embedded hardware and flight controller. Priya leads navigation algorithms.',
        attendees: [alex._id, samantha._id, marcus._id, priya._id],
      },
      {
        project: project._id,
        title: 'Sensor Selection & Hardware Architecture',
        date: daysFromNow(-11),
        content:
          'Evaluated Intel RealSense vs 2D LIDAR. Decided to combine lightweight 2D LIDAR with forward stereo camera. Power budget analyzed: Jetson requires dedicated 5V 4A buck converter regulator.',
        attendees: [alex._id, samantha._id, marcus._id],
      },
      {
        project: project._id,
        title: 'Midterm Progress Sprint Checkpoint',
        date: daysFromNow(-3),
        content:
          'Discussed LIDAR driver latency issues. Marcus will profile the SPI communication bus. Samantha demonstrated 28 FPS inference on Jetson using TensorRT float16 precision.',
        attendees: [alex._id, samantha._id, marcus._id, priya._id],
      },
    ]);

    // 6. Create 4 Project Milestones
    console.log('🎯 Creating 4 project milestones...');
    await Milestone.create([
      {
        project: project._id,
        title: 'Architecture & Safety Proposal Approval',
        description: 'Formal course committee signoff on design spec and flight safety protocol.',
        dueDate: daysFromNow(-12),
        status: 'Completed',
      },
      {
        project: project._id,
        title: 'Midterm Functional Hardware Demonstration',
        description: 'Tethered flight demonstration with live camera feed telemetry in laboratory.',
        dueDate: daysFromNow(5),
        status: 'In Progress',
      },
      {
        project: project._id,
        title: 'Full Autonomous Obstacle Avoidance Run',
        description: 'Successful untethered course traversal with 3 dynamic obstacles.',
        dueDate: daysFromNow(25),
        status: 'Pending',
      },
      {
        project: project._id,
        title: 'Final Capstone Poster Presentation & Paper',
        description: 'Deliverable thesis report, video demo reel, and conference poster submission.',
        dueDate: daysFromNow(45),
        status: 'Pending',
      },
    ]);

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`   Project Created: "${project.name}" (ID: ${project._id})`);
    console.log('   Ready to explore in GroupProject Hub UI.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

