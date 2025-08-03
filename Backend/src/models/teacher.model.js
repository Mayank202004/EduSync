import mongoose, {Schema} from "mongoose";

const TeacherSchema = Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  position:{
    type: String,
    enum: ["PGT", "TGT", "PRT", "Sports Teacher", "Principal", "Vice Principal", "Music Teacher", "Art Teacher"]
  },
  classTeacher:
  {
    class:{
        type:String
},
    div:{
        type:String
    }
  },
  classCoordinator:{
    type: String,
    enum:["Sr. Kg","Jr. Kg","1","2","3","4","5","6","7","8","9","10"]
  },

  subjects: [
    {
      name: { type: String},
      classes: [
        { 
            class:{
                type: String
            },
            div:[{
                type:String
            }]
        }
      ]
    }
  ],
  phone: {
    type: String,
  },
  address: {
    type: String
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", TeacherSchema);


// Make handwritten to db marklist storage functionality using ML  