const fs = require('fs');
const path = require('path');

const REPOS_DIR = path.resolve(__dirname, '../.repos_cache');
const DOCS_DIR = path.resolve(__dirname, '../my-learning-hub/src/content/docs');

const GIT_LINKS = {
  php: {
    name: 'Echo-Scaler/php-courses',
    url: 'https://github.com/Echo-Scaler/php-courses',
    title: 'PHP & Modern Web Development Courses'
  },
  javascript: {
    name: 'Echo-Scaler/php-courses (JavaScript)',
    url: 'https://github.com/Echo-Scaler/php-courses',
    title: 'Modern JavaScript Mastery'
  },
  laravel: {
    name: 'Echo-Scaler/php-courses (Laravel)',
    url: 'https://github.com/Echo-Scaler/php-courses',
    title: 'Laravel High-Performance Architecture'
  },
  mysql: {
    name: 'Echo-Scaler/php-courses (MySQL)',
    url: 'https://github.com/Echo-Scaler/php-courses',
    title: 'MySQL Production Database Mastery'
  },
  eccube: {
    name: 'Echo-Scaler/ec-cube-specialCourse',
    url: 'https://github.com/Echo-Scaler/ec-cube-specialCourse',
    title: 'EC-CUBE 4 Special Enterprise Course'
  },
  devops: {
    name: 'Echo-Scaler/docker-course',
    url: 'https://github.com/Echo-Scaler/docker-course',
    title: 'Docker & DevOps Master Course'
  },
  toeic: {
    name: 'Echo-Scaler/toeic',
    url: 'https://github.com/Echo-Scaler/toeic',
    title: 'TOEIC High-Score Mastery Hub'
  }
};

function cleanStringForYaml(str) {
  if (!str) return '';
  return str
    .replace(/["\\]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

function processMarkdownFile(srcFilePath, destFilePath, courseKey) {
  let content = fs.readFileSync(srcFilePath, 'utf8');

  // Fix known highlighting issues
  content = content.replace(/```env\b/g, '```ini');

  const repoBanner = '';

  let title = '';
  let description = '';

  // Check if existing frontmatter exists
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (fmMatch) {
    let fmContent = fmMatch[1];
    let body = fmMatch[2];

    const titleMatch = fmContent.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      title = cleanStringForYaml(titleMatch[1]);
    }

    const descMatch = fmContent.match(/^description:\s*(.+)$/m);
    if (descMatch) {
      description = cleanStringForYaml(descMatch[1]);
    }

    if (!title) {
      title = path.basename(srcFilePath, path.extname(srcFilePath)).replace(/[-_]/g, ' ');
    }
    if (!description) {
      description = `${title} - Complete documentation and guide.`;
    }

    const newFrontmatter = `---\ntitle: "${cleanStringForYaml(title)}"\ndescription: "${cleanStringForYaml(description)}"\n---`;
    const finalContent = `${newFrontmatter}\n\n${repoBanner}${body}`;
    fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
    fs.writeFileSync(destFilePath, finalContent, 'utf8');
    return;
  }

  // No frontmatter: extract title from first # heading
  const lines = content.split(/\r?\n/);
  let titleIndex = -1;

  for (let i = 0; i < Math.min(lines.length, 25); i++) {
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
  for (let i = titleIndex + 1; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('![')) {
      description = line.replace(/[*_`]/g, '').slice(0, 160);
      break;
    }
  }

  if (!description) {
    description = `${title} - Comprehensive guide from beginner to senior engineer level.`;
  }

  // If there was a # heading, convert it to ## in body to avoid duplicate h1
  if (titleIndex !== -1) {
    lines[titleIndex] = `## ${title}`;
  }

  const cleanBody = lines.join('\n');
  const frontmatter = `---\ntitle: "${cleanStringForYaml(title)}"\ndescription: "${cleanStringForYaml(description)}"\n---`;
  const finalContent = `${frontmatter}\n\n${repoBanner}${cleanBody}`;

  fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
  fs.writeFileSync(destFilePath, finalContent, 'utf8');
}

function copyDirectory(srcDir, destDir, courseKey) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const srcPath = path.join(srcDir, entry.name);
    const safeName = entry.name.toLowerCase().replace(/\s+/g, '_');
    const destPath = path.join(destDir, safeName);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, courseKey);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      processMarkdownFile(srcPath, destPath, courseKey);
    }
  }
}

console.log('Starting full course synchronization...');

// 1. PHP Course
console.log('Processing PHP...');
copyDirectory(path.join(REPOS_DIR, 'php-courses/lessons'), path.join(DOCS_DIR, 'php'), 'php');
if (fs.existsSync(path.join(REPOS_DIR, 'php-courses/README.md'))) {
  processMarkdownFile(path.join(REPOS_DIR, 'php-courses/README.md'), path.join(DOCS_DIR, 'php/00_overview.md'), 'php');
}

// 2. JavaScript Course
console.log('Processing JavaScript...');
copyDirectory(path.join(REPOS_DIR, 'php-courses/javascript_lessons'), path.join(DOCS_DIR, 'javascript'), 'javascript');
if (fs.existsSync(path.join(REPOS_DIR, 'php-courses/JAVASCRIPT_BEGINNER_TO_MASTER.md'))) {
  processMarkdownFile(path.join(REPOS_DIR, 'php-courses/JAVASCRIPT_BEGINNER_TO_MASTER.md'), path.join(DOCS_DIR, 'javascript/00_overview.md'), 'javascript');
}

// 3. Laravel Course
console.log('Processing Laravel...');
copyDirectory(path.join(REPOS_DIR, 'php-courses/laravel_lessons'), path.join(DOCS_DIR, 'laravel'), 'laravel');
if (fs.existsSync(path.join(REPOS_DIR, 'php-courses/LARAVEL_BEGINNER_TO_MASTER.md'))) {
  processMarkdownFile(path.join(REPOS_DIR, 'php-courses/LARAVEL_BEGINNER_TO_MASTER.md'), path.join(DOCS_DIR, 'laravel/00_overview.md'), 'laravel');
}

// 4. MySQL Course
console.log('Processing MySQL...');
copyDirectory(path.join(REPOS_DIR, 'php-courses/mysql_lessons'), path.join(DOCS_DIR, 'mysql'), 'mysql');
if (fs.existsSync(path.join(REPOS_DIR, 'php-courses/MYSQL_BEGINNER_TO_MASTER.md'))) {
  processMarkdownFile(path.join(REPOS_DIR, 'php-courses/MYSQL_BEGINNER_TO_MASTER.md'), path.join(DOCS_DIR, 'mysql/00_overview.md'), 'mysql');
}

// 5. DevOps & Docker Course
console.log('Processing DevOps...');
// Core docker course
copyDirectory(path.join(REPOS_DIR, 'docker-course'), path.join(DOCS_DIR, 'devops/01_docker_core'), 'devops');
// Kubernetes & Cloud from php-courses
copyDirectory(path.join(REPOS_DIR, 'php-courses/docker_kubernetes_lessons'), path.join(DOCS_DIR, 'devops/02_kubernetes_and_cloud'), 'devops');
if (fs.existsSync(path.join(REPOS_DIR, 'php-courses/DOCKER_KUBERNETES_BEGINNER_TO_MASTER.md'))) {
  processMarkdownFile(path.join(REPOS_DIR, 'php-courses/DOCKER_KUBERNETES_BEGINNER_TO_MASTER.md'), path.join(DOCS_DIR, 'devops/00_overview.md'), 'devops');
}

// 6. EC-CUBE Special Course
console.log('Processing EC-CUBE...');
const ecCubeDir = path.join(REPOS_DIR, 'ec-cube-specialCourse');
const ecCubeEntries = fs.readdirSync(ecCubeDir, { withFileTypes: true });

for (const entry of ecCubeEntries) {
  if (entry.name.startsWith('.') || !entry.isDirectory()) continue;
  let targetSubdir = entry.name.replace(/^ec-cube-/, '');
  
  if (entry.name === 'ec-cube-course-basic') {
    targetSubdir = '01_basics';
  } else if (entry.name === 'ec-cube-30-client-tasks') {
    targetSubdir = '02_client_tasks';
  } else if (entry.name === 'ec-cube-order-management') {
    targetSubdir = '03_order_management';
  } else if (entry.name === 'ec-cube-payment') {
    targetSubdir = '04_payment';
  } else if (entry.name === 'ec-cube-shipping') {
    targetSubdir = '05_shipping';
  } else if (entry.name === 'ec-cube-customer-management') {
    targetSubdir = '06_customer_management';
  } else if (entry.name === 'ec-cube-security') {
    targetSubdir = '07_security';
  } else if (entry.name === 'ec-cube-campaign-coupon') {
    targetSubdir = '08_campaign_coupon';
  } else if (entry.name === 'ec-cube-template-course') {
    targetSubdir = '09_template_design';
  }

  copyDirectory(path.join(ecCubeDir, entry.name), path.join(DOCS_DIR, 'eccube', targetSubdir), 'eccube');
}

// 7. TOEIC Course
console.log('Processing TOEIC...');
const toeicDir = path.join(REPOS_DIR, 'toeic');
const toeicEntries = fs.readdirSync(toeicDir, { withFileTypes: true });

for (const entry of toeicEntries) {
  if (entry.name.startsWith('.') || !entry.isDirectory()) continue;
  const safeName = entry.name.toLowerCase();
  copyDirectory(path.join(toeicDir, entry.name), path.join(DOCS_DIR, 'toeic', safeName), 'toeic');
}

console.log('Course synchronization completed successfully!');
