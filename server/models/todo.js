import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 2],
      default: 2,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    virtuals: {
      id: {
        get() {
          return this._id
        },
      },
    },
  }
)

schema.statics.deleteDone = function () {
  return this.deleteMany({ status: 1 })
}

const model = mongoose.model('Todo', schema)

export default model