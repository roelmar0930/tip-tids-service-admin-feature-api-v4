const ImageService = require("../services/ImageService");

const getSignedUrl = async (req, res, next) => {
  try {
    const imageUrl = await ImageService.getSignedUrl(req.query);
    res.status(200).json(imageUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSignedUrl };
