const fs = require('fs');
const path = require('path');

const SRC_DIR = '/tmp/aws-repo';
const DEST_DIR = path.resolve(__dirname, '../my-learning-hub/src/content/docs/aws');

function cleanStringForYaml(str) {
  if (!str) return '';
  return str
    .replace(/["\\]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

function processMarkdownFile(srcFilePath, destFilePath, defaultTitle, defaultDesc) {
  let content = fs.readFileSync(srcFilePath, 'utf8');

  // Fix known syntax highlighting tags that cause Astro / Prism warnings
  content = content.replace(/```env\b/g, '```ini');

  let title = defaultTitle || '';
  let description = defaultDesc || '';

  // Check if existing frontmatter exists
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let body = content;

  if (fmMatch) {
    const fmContent = fmMatch[1];
    body = fmMatch[2];

    const titleMatch = fmContent.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      title = cleanStringForYaml(titleMatch[1]);
    }
    const descMatch = fmContent.match(/^description:\s*(.+)$/m);
    if (descMatch) {
      description = cleanStringForYaml(descMatch[1]);
    }
  } else {
    // No frontmatter: extract title from first # heading
    const lines = content.split(/\r?\n/);
    let titleIndex = -1;

    for (let i = 0; i < Math.min(lines.length, 30); i++) {
      const line = lines[i].trim();
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '').trim();
        titleIndex = i;
        break;
      }
    }

    if (!title) {
      title = path.basename(srcFilePath, path.extname(srcFilePath))
        .replace(/^\d+[-_]?/, '')
        .replace(/[-_]/g, ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    // Look for description in subtitle or first paragraph
    for (let i = titleIndex + 1; i < Math.min(lines.length, 35); i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('![') && !line.startsWith('>')) {
        description = line.replace(/[*_`]/g, '').slice(0, 160);
        break;
      }
      if (line && line.startsWith('>')) {
        description = line.replace(/^>\s*/, '').replace(/[*_`]/g, '').slice(0, 160);
        break;
      }
    }

    if (!description) {
      description = `${title} - AWS Cloud & DevOps Production Real-Work Guide in Burmese.`;
    }

    // Convert top # heading to ## in body to avoid duplicate H1
    if (titleIndex !== -1) {
      lines[titleIndex] = `## ${title}`;
      body = lines.join('\n');
    }
  }

  // Ensure title and description are clean for YAML
  const frontmatter = `---\ntitle: "${cleanStringForYaml(title)}"\ndescription: "${cleanStringForYaml(description)}"\n---`;
  const finalContent = `${frontmatter}\n\n${body.trim()}\n`;

  fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
  fs.writeFileSync(destFilePath, finalContent, 'utf8');
  console.log(`Processed: ${path.relative(DEST_DIR, destFilePath)} (${title})`);
}

function copyDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory does not exist: ${srcDir}`);
    return;
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.toLowerCase() === 'readme.md') continue;
    const srcPath = path.join(srcDir, entry.name);
    const safeName = entry.name.toLowerCase().replace(/\s+/g, '_');
    const destPath = path.join(destDir, safeName);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      processMarkdownFile(srcPath, destPath);
    }
  }
}

// 0. Ensure DEST_DIR exists
fs.mkdirSync(DEST_DIR, { recursive: true });

// 1. Overview Page
console.log('Importing AWS Overview...');
const overviewSrc = path.join(SRC_DIR, 'AWS_Beginner_to_Advanced_Real_Work_Burmese.md');
if (fs.existsSync(overviewSrc)) {
  processMarkdownFile(
    overviewSrc,
    path.join(DEST_DIR, '00_overview.md'),
    'AWS Cloud & DevOps Production Master Guide (မြန်မာဘာသာ)',
    'AWS Beginner မှ Senior Solutions Architect အထိ Japan IT & Global Cloud Production Real-Work Labs'
  );
}

// 2. Networking and Security Foundations
console.log('Importing Networking & Security Foundations...');
copyDirectory(
  path.join(SRC_DIR, 'aws_networking_and_security_foundations'),
  path.join(DEST_DIR, '01_networking_and_security')
);

// 3. Beginner to Advanced Real Work
console.log('Importing Beginner to Advanced Real Work...');
copyDirectory(
  path.join(SRC_DIR, 'aws_beginner_to_advanced_real_work'),
  path.join(DEST_DIR, '02_beginner_to_advanced_real_work')
);

// 4. Solutions Architect Real Work
console.log('Importing SAA Solutions Architect Real Work...');
copyDirectory(
  path.join(SRC_DIR, 'aws_saa_solutions_architect_real_work'),
  path.join(DEST_DIR, '03_saa_solutions_architect_real_work')
);

// 5. SAA-C03 Practice Exams
console.log('Importing SAA-C03 Practice Exams...');
copyDirectory(
  path.join(SRC_DIR, 'aws_saa_c03_practice_exams'),
  path.join(DEST_DIR, '04_saa_c03_practice_exams')
);

console.log('AWS Course Import Completed Successfully!');
