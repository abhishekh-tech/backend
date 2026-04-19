const Skills = require('../models/Skills');

const createSkill = async (skillData, file) => {
  const { title, desc, category, level, contentType } = skillData;

  const newSkill = new Skills({
    ...skillData,
    content: file ? {
      type: contentType || 'text',
      fileName: file.originalname,
      fileSize: file.size,
      fileData: file.buffer,
      mimeType: file.mimetype,
    } : undefined
  });

  const skill = await newSkill.save();
  const skillObj = skill.toObject();
  if (skillObj.content) delete skillObj.content.fileData;
  return skillObj;
};

const getSkills = async (filter = {}) => {
  return await Skills.find(filter)
    .select('-content.fileData')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

const getSkillById = async (id) => {
  const skill = await Skills.findById(id);
  if (!skill) throw new Error('Skill not found');
  return skill;
};

const updateSkill = async (id, updateData, file) => {
  const skill = await Skills.findById(id);
  if (!skill) throw new Error('Skill not found');

  Object.assign(skill, updateData);

  if (file) {
    skill.content = {
      type: updateData.contentType || skill.content?.type || 'text',
      fileName: file.originalname,
      fileSize: file.size,
      fileData: file.buffer,
      mimeType: file.mimetype,
    };
  } else if (updateData.contentType && skill.content) {
    skill.content.type = updateData.contentType;
  }

  await skill.save();
  const skillObj = skill.toObject();
  if (skillObj.content) delete skillObj.content.fileData;
  return skillObj;
};

const deleteSkill = async (id) => {
  const skill = await Skills.findByIdAndDelete(id);
  if (!skill) throw new Error('Skill not found');
  return { message: 'Skill deleted successfully' };
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
