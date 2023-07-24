CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'student') NOT NULL
  );

CREATE TABLE journals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    tagged_students VARCHAR(255), -- Store student IDs as comma-separated string
    attachment_type ENUM('Image', 'Video', 'URL', 'PDF'),
    attachment_data TEXT,
    published_at DATETIME,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);