import fs from "fs";
import path from "path";

interface FieldInfo {
  name: string;
  type: string;
  constraints: string[];
}

interface SchemaCard {
  filename: string;
  templateName: string;
  fields: FieldInfo[];
  rawLines: number;
}

/**
 * Very lightweight static analysis of a zod schema file.
 * Extracts field names and some common constraints without
 * executing the module (safe for a server component).
 */
function parseSchemaFile(content: string): FieldInfo[] {
  const fields: FieldInfo[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match lines like:   field_name: z.string().min(10).max(65),
    const match = line.match(/^\s{2,}(\w+):\s*z\.(\w+)\(([^)]*)\)(.*),?\s*$/);
    if (!match) continue;

    const name = match[1];
    const baseType = match[2];
    const rest = match[4] ?? "";

    const constraints: string[] = [];

    // min/max on the rest chain
    const minMatch = rest.match(/\.min\((\d+)\)/);
    const maxMatch = rest.match(/\.max\((\d+)\)/);
    if (minMatch) constraints.push(`min: ${minMatch[1]}`);
    if (maxMatch) constraints.push(`max: ${maxMatch[1]}`);

    // optional
    if (rest.includes(".optional()")) constraints.push("optional");

    // array?
    const isArray = baseType === "array";
    const displayType = isArray ? "array" : baseType;

    fields.push({ name, type: displayType, constraints });
  }

  return fields;
}

function getSchemaCards(): SchemaCard[] {
  const schemasDir = path.join(process.cwd(), "src/data/schemas");
  const files = fs.readdirSync(schemasDir).filter(
    (f) => f.endsWith(".schema.ts") || (f.endsWith(".ts") && f !== "index.ts")
  );

  return files.map((filename) => {
    const filePath = path.join(schemasDir, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").length;
    const fields = parseSchemaFile(content);
    const templateName = filename
      .replace(".schema.ts", "")
      .replace(".ts", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { filename, templateName, fields, rawLines: lines };
  });
}

export default function SchemasPage() {
  const schemas = getSchemaCards();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Schemas</h1>
      <p className="text-gray-400 text-sm mb-8">
        {schemas.length} template schemas — read-only (changes require code edits)
      </p>

      <div className="space-y-6">
        {schemas.map((schema) => (
          <div
            key={schema.filename}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">{schema.templateName}</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{schema.filename}</p>
              </div>
              <span className="text-xs text-gray-600">{schema.rawLines} lines</span>
            </div>

            {/* Fields table */}
            {schema.fields.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Field
                      </th>
                      <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Constraints
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.fields.map((field, i) => (
                      <tr
                        key={field.name}
                        className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}
                      >
                        <td className="px-6 py-2 font-mono text-xs text-indigo-300">
                          {field.name}
                        </td>
                        <td className="px-6 py-2 text-xs text-gray-300">{field.type}</td>
                        <td className="px-6 py-2 text-xs text-gray-500">
                          {field.constraints.length > 0
                            ? field.constraints.join(", ")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-6 py-4 text-sm text-gray-600">
                No top-level fields detected — view the file directly for full schema.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
