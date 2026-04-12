const mongoose = require('mongoose');


// Scheme for Student model
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Navn er påkrævet'],
      trim: true,
      minlength: [2, 'Navn skal mindst være 2 tegn'],
    },
    age: {
      type: Number,
      required: [true, 'Alder er påkrævet'],
      min: [0, 'Alder kan ikke være negativ'],
      max: [130, 'Alder virker ikke gyldig'],
    },
    email: {
      type: String,
      required: [true, 'Email er påkrævet'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    team: {
      type: String,
      required: [true, 'Hold er påkrævet'],
      trim: true,
    },
  },
  {
    timestamps: true, // Tilføjer createdAt og updatedAt
  }
);

module.exports = mongoose.model('Student', studentSchema);
