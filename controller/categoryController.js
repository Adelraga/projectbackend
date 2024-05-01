const Category = require("../models/Category");

module.exports = {
  createCategory: async (req, res) => {
    const categoryBody = req.body;
    try {
      const categor = await Category.findOne({ title: categoryBody.title });
      if (categor) {
        return res.status(400).json({ message: "Category already exist" });
      }
      const category = new Category(categoryBody);
      await category.save();
      return res
        .status(201)
        .json({ status: "Success", message: "category created Successfully" });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: "an error occured while creating the category",
        error: err.message,
      });
    }
  },
  getAllCategories: async (req, res) => {
    const query = req.query; //  {{BASE_URL}}/api/users/getAllUsers?page=2 to controll the limit and the number of page in postman for pagination

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    try {
      const categories = await Category.find({}, {}).limit(limit).skip(skip);
      if (!categories) {
        return res.status(500).json({
          status: "Failed",
          message: "No Categories",
          error: err.message,
        });
      } else {
        return res.status(200).json({ status: "Success", data: categories });
      }
    } catch (error) {
      return res.status(404).json({ status: "Failed", msg: error.message });
    }
  },
  updateCategory: async (req, res) => {
    const id = req.params.id;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({
          status: "Failed",
          error: "category not found",
        });
      } else {
        return res.status(200).json({
          status: "success",
          message: "Updated successfully",
          data: category,
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        status: "failure",
        message: e.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(403)
          .json({ status: "failed", message: "Category not found" });
      } else {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
          return res.status(500).json({
            status: "failure",
            message: "Delete failed",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "Deleted Successfully",
            data: deletedCategory,
          });
        }
      }
    } catch (e) {
      return res.status(500).json({
        status: "failure",
        message: "Failed to Delete category",
      });
    }
  },
  getCategory: async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          status: "failed",
          error: "the category doesn't Exist",
        });
      } else {
        return res.status(200).json({ status: "success", data: { category } });
      }
    } catch (error) {
      return res.status(500).json({ status: "fail", error });
    }
  },

  patchCategoryImage: async (req, res) => {
    const categoryId = req.params.categoryId;
    const imageUrl = req.body;
    try {
      const existingCategory = await Category.findById(categoryId);
      const updateCategory = new Category({
        title: existingCategory.title,
        value: existingCategory.value,
        imageUrl: `http://localhost:3000/uploads/${existingCategory.imageUrl}`,
      });
      await updateCategory.save();
      if (!updateCategory) {
        return res.status(404).send("Update Failed");
      } else {
        return res.status(201).send("Updated Successfuly");
      }
    } catch (err) {
      return res.status(500).send("Server Error");
    }
  },
  getRandomCategory: async (req, res) => {
    try {
      let randomCategory = await Category.aggregate([
        { $sample: { size: 4 } },
        { $match: { value: { $ne: "more" } } },
      ]);
      const moreCategory = await Category.findOne({ value: "more" });
      if (moreCategory) {
        randomCategory.push(moreCategory);
      } else {
        console.log("no more");
      }
      return res
        .status(200)
        .json({ status: "success", data: { randomCategory } });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  },
};
