const Course = require('../models/Course');

const getCourses = async () => {
  return await Course.find().select('-content.fileData').sort({ createdAt: -1 });
};

const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new Error('Course not found');
  return course;
};

const createCourse = async (courseData, file) => {
  const { title, desc, category, author, contentType } = courseData;

  if (!title || !desc || !category || !contentType || !file) {
    throw new Error('Please enter all required fields and upload a file');
  }

  const newCourse = new Course({
    title,
    desc,
    category,
    author: author || 'Anonymous Teacher',
    content: {
      type: contentType,
      fileName: file.originalname,
      fileSize: file.size,
      fileData: file.buffer,
      mimeType: file.mimetype,
    }
  });

  const course = await newCourse.save();
  const courseResponse = course.toObject();
  delete courseResponse.content.fileData;
  return courseResponse;
};

const updateCourse = async (id, courseData, file) => {
  const course = await Course.findById(id);
  if (!course) throw new Error('Course not found');

  if (courseData.title) course.title = courseData.title;
  if (courseData.desc) course.desc = courseData.desc;
  if (courseData.category) course.category = courseData.category;
  if (courseData.author) course.author = courseData.author;
  if (courseData.contentType) course.content.type = courseData.contentType;

  if (file) {
    course.content.fileName = file.originalname;
    course.content.fileSize = file.size;
    course.content.fileData = file.buffer;
    course.content.mimeType = file.mimetype;
  }

  await course.save();
  const courseResponse = course.toObject();
  delete courseResponse.content.fileData;
  return courseResponse;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new Error('Course not found');
  return { message: 'Course deleted successfully' };
};

// Functions intended to handle embedded content exclusively for "Course Content.js" routing map
const updateCourseContent = async (id, contentType, file) => {
    return await updateCourse(id, { contentType }, file);
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseContent
};
