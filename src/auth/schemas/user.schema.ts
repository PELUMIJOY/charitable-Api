import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;
  @Prop({
    unique: [true, { message: 'Email already exist' }],
  })
  email: string;
  @Prop()
  password: string;
  @Prop({ type: String })
  AreaOfInterst: {
    type: string;
    enum: ['Vocational Skill', 'Technical Skill'];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
