import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: 1,
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

schema.statics.getAll = async function (status, sort) {
  const filter = {}

  if (status) {
    filter.status = status
  }

  let _sort = null

  if (!sort || (_sort?.field && !_sort?.order) || (_sort?.order && !_sort?.field)) {
    _sort = { createdAt: 1 }
  } else {
    _sort = { [sort.field]: sort.order }
  }

  const items = await this.find(filter).sort(_sort)

  const counters = {
    all: await this.countDocuments(),
    done: await this.countDocuments({ status: 1 }),
    notDone: await this.countDocuments({ status: 2 }),
  }

  return { items, counters }
}

schema.statics.deleteDone = function () {
  return this.deleteMany({ status: 1 })
}

const model = mongoose.model('Todo', schema)

export default model
