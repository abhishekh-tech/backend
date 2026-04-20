const courseService = require('../services/courseService');

const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (err) {
    if (err.message === 'Course not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body, req.file);
    res.status(201).json(course);
  } catch (err) {
    if (err.message.includes('required fields') || err.message.includes('upload a file')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.file);
    res.json(course);
  } catch (err) {
    if (err.message === 'Course not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Course not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

// Functions intended to handle embedded content exclusively for "Course Content.js" routing map
const updateCourseContent = async (req, res) => {
    try {
        const course = await courseService.updateCourseContent(req.params.id, req.body.contentType, req.file);
        res.json(course);
    } catch(err) {
        if(err.message === 'Course not found') return res.status(404).json({ message: err.message });
        res.status(500).json({ message: err.message });
    }
};

const downloadCourseContent = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course || !course.content.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${course.content.fileName}"`);
    res.setHeader('Content-Type', course.content.mimeType);
    res.send(course.content.fileData);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const streamCourseContent = async (req, res) => {
  try {
    // Optimization: Only fetch the 'content' field to reduce DB overhead
    const Course = require('../models/Course');
    const course = await Course.findById(req.params.id).select('content');
    
    if (!course || !course.content || !course.content.fileData) {
      console.log(`[Stream] Course content not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'File not found' });
    }

    const { fileData, mimeType, fileName } = course.content;
    const fileSize = fileData.length;
    const range = req.headers.range;

    console.log(`[Stream] Serving: ${fileName} (${mimeType}), Size: ${fileSize} bytes, Range: ${range || 'none'}`);

    // Set standard headers for file streaming
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', mimeType);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).send('Requested range not satisfiable');
      }

      const chunksize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunksize,
      });

      res.end(fileData.slice(start, end + 1));
    } else {
      res.setHeader('Content-Length', fileSize);
      res.status(200).send(fileData);
    }
  } catch (err) {
    console.error(`[Stream Error] ${err.message}`);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseContent,
  downloadCourseContent,
  streamCourseContent
};
