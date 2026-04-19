const skillService = require('../services/skillService');

const createSkill = async (req, res) => {
  try {
    const skill = await skillService.createSkill({ ...req.body, createdBy: req.user._id }, req.file);
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSkills = async (req, res) => {
  try {
    const filter = {};
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    const skills = await skillService.getSkills(filter);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.id);
    res.json(skill);
  } catch (err) {
    if (err.message === 'Skill not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await skillService.updateSkill(req.params.id, req.body, req.file);
    res.json(skill);
  } catch (err) {
    if (err.message === 'Skill not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const result = await skillService.deleteSkill(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Skill not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const downloadSkillContent = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.id);
    if (!skill || !skill.content?.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${skill.content.fileName}"`);
    res.setHeader('Content-Type', skill.content.mimeType);
    res.send(skill.content.fileData);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const streamSkillContent = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.id);
    if (!skill || !skill.content || !skill.content.fileData) {
      console.log(`[Stream] Skill content not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'File not found' });
    }

    const { fileData, mimeType, fileName } = skill.content;
    const fileSize = fileData.length;
    const range = req.headers.range;

    console.log(`[Stream] Serving Skill: ${fileName} (${mimeType}), Size: ${fileSize} bytes, Range: ${range || 'none'}`);

    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Accept-Ranges', 'bytes');

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
        'Content-Type': mimeType,
      });

      res.end(fileData.slice(start, end + 1));
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });

      res.end(fileData);
    }
  } catch (err) {
    console.error(`[Stream Error] ${err.message}`);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  downloadSkillContent,
  streamSkillContent
};
