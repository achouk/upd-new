import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Page } from './page.schema';
import { Project } from './project.schema';
import { Task } from './task.schema';

export type UxTestDocument = UxTest & Document;

@Schema({ collection: 'ux_tests' })
export class UxTest {
  @Prop({ required: true, unique: true })
  _id: Types.ObjectId = new Types.ObjectId('');

  @Prop({ required: true, unique: true })
  airtable_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UxTest' })
  project: Project;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Page' }] })
  pages?: Page[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks?: Task[];

  @Prop({ type: String })
  subtask? = '';

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: Number })
  success_rate?: number;

  @Prop({ type: String })
  test_type?: string;

  @Prop({ type: String })
  session_type?: string;

  @Prop({ type: String })
  scenario?: string;

  @Prop({ type: String })
  vendor?: string;

  @Prop({ type: String })
  version_tested?: string;

  @Prop({ type: String })
  github_repo?: string;

  @Prop({ type: Number })
  total_users?: number;

  @Prop({ type: Number })
  successful_users?: number;

  @Prop({ type: String })
  program?: string;

  @Prop({ type: String })
  branch?: string;

  @Prop({ type: String })
  project_lead?: string;

  @Prop({ type: Date })
  launch_date?: Date;

  @Prop({ type: String })
  status?: string;

  @Prop({ type: Boolean })
  cops?: boolean;
}

export const UxTestSchema = SchemaFactory.createForClass(UxTest);
