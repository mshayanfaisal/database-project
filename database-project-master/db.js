import { neon } from "@neondatabase/serverless";

export const sql = neon(
  `postgresql://db_project_owner:npg_drQ8iVwKfHg3@ep-divine-glitter-a8ezq9pf-pooler.eastus2.azure.neon.tech/db_project?sslmode=require&channel_binding=require`
);
