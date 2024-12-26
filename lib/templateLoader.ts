import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";

export async function loadTemplate(templateName: string, data: object) {
  const templatePath = path.join(
    process.cwd(),
    "templates/emails",
    `${templateName}.hbs`
  );
  const template = await fs.readFile(templatePath, "utf-8");
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
