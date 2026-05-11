// File operation utilities for reading, writing, and managing test files.
import fs from 'fs';
import path from 'path';

export class FileHelpers {
  // Read a JSON file and parse it
  static readJsonFile(filePath: string): any {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  // Write data to a JSON file
  static writeJsonFile(filePath: string, data: any): void {
    const absolutePath = path.resolve(filePath);
    const dir = path.dirname(absolutePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Read a text file
  static readTextFile(filePath: string): string {
    const absolutePath = path.resolve(filePath);
    return fs.readFileSync(absolutePath, 'utf-8');
  }

  // Write text to a file
  static writeTextFile(filePath: string, content: string): void {
    const absolutePath = path.resolve(filePath);
    const dir = path.dirname(absolutePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content, 'utf-8');
  }

  // Check if a file exists
  static fileExists(filePath: string): boolean {
    const absolutePath = path.resolve(filePath);
    return fs.existsSync(absolutePath);
  }

  // Delete a file
  static deleteFile(filePath: string): void {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }

  // Create a directory
  static createDirectory(dirPath: string): void {
    const absolutePath = path.resolve(dirPath);
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
  }

  // List files in a directory
  static listFiles(dirPath: string): string[] {
    const absolutePath = path.resolve(dirPath);
    if (!fs.existsSync(absolutePath)) {
      return [];
    }
    return fs.readdirSync(absolutePath);
  }

  // Get file extension
  static getFileExtension(fileName: string): string {
    return path.extname(fileName);
  }

  // Get file name without extension
  static getFileNameWithoutExtension(fileName: string): string {
    return path.basename(fileName, path.extname(fileName));
  }

  // Read CSV file (simple implementation)
  static readCsvFile(filePath: string): string[][] {
    const content = this.readTextFile(filePath);
    const lines = content.split('\n').filter((line) => line.trim());
    return lines.map((line) => line.split(',').map((cell) => cell.trim()));
  }

  // Write CSV file (simple implementation)
  static writeCsvFile(filePath: string, data: string[][]): void {
    const csvContent = data.map((row) => row.join(',')).join('\n');
    this.writeTextFile(filePath, csvContent);
  }

  // Copy file
  static copyFile(sourcePath: string, destPath: string): void {
    const sourceAbsolute = path.resolve(sourcePath);
    const destAbsolute = path.resolve(destPath);
    const destDir = path.dirname(destAbsolute);

    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(sourceAbsolute, destAbsolute);
  }

  // Get file stats
  static getFileStats(filePath: string): fs.Stats | null {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      return null;
    }
    return fs.statSync(absolutePath);
  }
}
