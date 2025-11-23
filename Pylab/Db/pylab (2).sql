-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 03:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pylab`
--

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `lesson_number` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `key_notes` text DEFAULT NULL,
  `syntax` text DEFAULT NULL,
  `important_questions` text DEFAULT NULL,
  `youtube_link` varchar(255) DEFAULT NULL,
  `document_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `level_id`, `lesson_number`, `title`, `content`, `key_notes`, `syntax`, `important_questions`, `youtube_link`, `document_link`) VALUES
(1, 1, 1, 'Introduction to Python', 'Python is a popular high-level programming language known for its simplicity and readability. It allows developers to write code in fewer lines compared to many other languages. Python was created by Guido van Rossum and released in 1991. It is widely used in fields such as web development, data science, artificial intelligence, automation, and software development.', 'Easy, interpreted, widely used', 'print(\"Hello World\")', '1. What is Python? 2. Why Python is popular?', 'https://youtube.com/watch?v=vid1', 'https://drive.google.com/doc1'),
(2, 1, 2, 'Installing Python', 'To start programming in Python, you must install Python on your system. Download the latest version from official Python website and install it. Make sure Python is added to PATH  : Link : https://www.python.org/', 'Download → Install → Add PATH → Open Editor', 'python --version', '1. How to install Python? 2. What is PATH? 3. How to check Python version?', 'https://youtube.com/watch?v=vid2', 'https://drive.google.com/doc2'),
(3, 1, 3, 'Variables', 'Variables are used to store data in Python. A variable is created when a value is assigned to it. Python does not need explicit type declaration.', 'Stores values, auto typed, case sensitive', 'name = \"John\"', '1. What is a variable? 2. How do you declare a variable?', 'https://youtube.com/watch?v=vid3', 'https://drive.google.com/doc3'),
(4, 1, 4, 'Data Types', 'Data types define the type of data a variable can hold. Python provides several built-in data types such as int, float, string, list, tuple, set and dictionary.', 'Built-in types, dynamic typing', 'x = 10  # int', '1. What are data types? 2. Name 5 Python data types.', 'https://youtube.com/watch?v=vid4', 'https://drive.google.com/doc4'),
(5, 1, 5, 'Input & Output', 'Python allows users to take input using the input() function and display output using the print() function.', 'input(), print()', 'name = input(\"Enter name: \")', '1. Explain input and output. 2. Write input example.', 'https://youtube.com/watch?v=vid5', 'https://drive.google.com/doc5'),
(6, 1, 6, 'Loops', 'Loops are used to repeat a block of statements multiple times. Python mainly provides two types of loops: for loop and while loop.', 'For loop, While loop', 'for i in range(5): print(i)', '1. Define loop. 2. Advantages of loops. 3. Types of loops.', 'https://youtube.com/watch?v=vid6', 'https://drive.google.com/doc6'),
(7, 2, 7, 'Operators', 'Operators are symbols used to perform operations on variables and values in Python. Common operator types include arithmetic, comparison, logical, assignment and bitwise operators.', 'Arithmetic, Comparison, Logical', 'a = 10 + 5', '1. What are operators? 2. List types of operators.', 'https://youtube.com/watch?v=vid7', 'https://drive.google.com/doc7'),
(8, 2, 8, 'Conditional Statements', 'Conditional statements are used to make decisions based on conditions. In Python we mainly use if, elif and else statements to control program flow based on logical conditions.', 'if, elif, else', 'if age >= 18:\n    print(\"Adult\")', '1. What is a conditional statement? 2. Write example.', 'https://youtube.com/watch?v=vid8', 'https://drive.google.com/doc8'),
(9, 2, 9, 'Strings', 'Strings are sequences of characters enclosed in single or double quotes. Python allows indexing, slicing and a wide range of string methods.', 'Immutable, supports slicing', 'name = \"Python\"', '1. What is a string? 2. What is slicing?', 'https://youtube.com/watch?v=vid9', 'https://drive.google.com/doc9'),
(10, 2, 10, 'Lists', 'Lists are ordered, mutable collections used to store multiple values in a single variable. Lists can hold different data types.', 'Ordered, Mutable', 'fruits = [\"apple\", \"banana\", \"orange\"]', '1. Define list. 2. Write list example.', 'https://youtube.com/watch?v=vid10', 'https://drive.google.com/doc10'),
(11, 2, 11, 'Functions', 'Functions are reusable blocks of code that run only when called. They help reduce repetition and improve modularity in programs. Functions are created using the def keyword.', 'def keyword, reusable', 'def hello():\n    print(\"Hello!\")', '1. What is a function? 2. Why are functions used?', 'https://youtube.com/watch?v=vid11', 'https://drive.google.com/doc11'),
(12, 3, 12, 'Tuples', 'Tuples are ordered collections similar to lists but are immutable, meaning their values cannot be changed after creation.', 'Ordered, Immutable', 'numbers = (1, 2, 3)', '1. What is a tuple? 2. Difference between list & tuple?', 'https://youtube.com/watch?v=vid12', 'https://drive.google.com/doc12'),
(13, 3, 13, 'Dictionaries', 'Dictionaries store data in key-value pairs. They are unordered and mutable. Each value is accessed using a unique key.', 'Key → Value Mapping', 'student = {\"name\": \"Sam\", \"age\": 20}', '1. What is a dictionary? 2. Write example.', 'https://youtube.com/watch?v=vid13', 'https://drive.google.com/doc13'),
(14, 3, 14, 'Sets', 'Sets are unordered collections of unique values. They automatically remove duplicates and do not support indexing.', 'Unique values, No duplicates', 'nums = {1,2,3,3}', '1. Define Set. 2. Why do sets not allow duplicates?', 'https://youtube.com/watch?v=vid14', 'https://drive.google.com/doc14'),
(15, 3, 15, 'Type Casting', 'Type casting is used to convert one data type into another using built-in functions like int(), float(), str()', 'int(), float(), str()', 'x = int(\"10\")', '1. What is type casting? 2. Examples?', 'https://youtube.com/watch?v=vid15', 'https://drive.google.com/doc15'),
(16, 3, 16, 'Exception Handling', 'Exception handling allows us to manage runtime errors using try and except blocks, preventing crashes in programs.', 'try, except, finally', 'try:\n   x=10/0\nexcept:\n   print(\"Error\")', '1. What is exception handling? 2. Why is it needed?', 'https://youtube.com/watch?v=vid16', 'https://drive.google.com/doc16'),
(17, 4, 17, 'File Handling', 'File handling allows reading and writing data to external files using Python. Common operations include open, read, write and close.', 'open, read, write, close', 'file = open(\"data.txt\", \"r\")', '1. What is file handling? 2. Which function is used to open files?', 'https://youtube.com/watch?v=vid17', 'https://drive.google.com/doc17'),
(18, 4, 18, 'OOP - Classes & Objects', 'Object Oriented Programming models real-world entities using classes and objects. A class defines structure, and objects are instances of the class.', 'class, object, self', 'class Student:\n    pass', '1. What is OOP? 2. What is a Class and Object?', 'https://youtube.com/watch?v=vid18', 'https://drive.google.com/doc18'),
(19, 4, 19, 'Inheritance', 'Inheritance allows one class to access properties and methods of another class, reducing code duplication and improving reusability.', 'Single, Multi-level, Multiple', 'class Car: pass\nclass BMW(Car): pass', '1. What is inheritance? 2. Types of inheritance?', 'https://youtube.com/watch?v=vid19', 'https://drive.google.com/doc19'),
(20, 4, 20, 'Modules & Packages', 'Modules are Python files containing code and functions. Packages are collections of modules organized in folders.', 'import keyword', 'import math', '1. What is a module? 2. What is a package?', 'https://youtube.com/watch?v=vid20', 'https://drive.google.com/doc20'),
(21, 4, 21, 'Lambda Functions', 'Lambda functions are small anonymous functions used for short and simple operations.', 'anonymous, one-line functions', 'x = lambda a,b: a + b', '1. What is a lambda? 2. Where is lambda used?', 'https://youtube.com/watch?v=vid21', 'https://drive.google.com/doc21'),
(22, 5, 22, 'Decorators', 'Decorators allow modifying the behavior of functions without changing their code. They wrap another function and enhance its capability.', 'Wrapper functions, @decorator', 'def decorator(func):\n    pass', '1. What is a decorator? 2. Why are decorators used?', 'https://youtube.com/watch?v=vid22', 'https://drive.google.com/doc22'),
(23, 5, 23, 'Generators', 'Generators allow functions to return values one at a time using yield instead of returning an entire sequence at once.', 'yield keyword', 'def counter():\n    yield 1', '1. What is a generator? 2. Difference between return and yield?', 'https://youtube.com/watch?v=vid23', 'https://drive.google.com/doc23'),
(24, 5, 24, 'Multithreading', 'Multithreading allows running multiple tasks simultaneously in the same process, improving performance for I/O tasks.', 'threading module', 'import threading', '1. What is multithreading? 2. Why is it used?', 'https://youtube.com/watch?v=vid24', 'https://drive.google.com/doc24'),
(25, 5, 25, 'Database Connectivity', 'Python provides libraries to connect and interact with databases such as MySQL, SQLite, MongoDB and PostgreSQL.', 'cursor, commit, execute', 'import mysql.connector', '1. What is database connectivity? 2. Which libraries are used?', 'https://youtube.com/watch?v=vid25', 'https://drive.google.com/doc25'),
(26, 5, 26, 'API Handling', 'API handling allows Python to communicate with external services using HTTP requests. Commonly done using the Requests module.', 'HTTP, GET, POST', 'import requests', '1. What is an API? 2. How to call an API using Python?', 'https://youtube.com/watch?v=vid26', 'https://drive.google.com/doc26');

-- --------------------------------------------------------

--
-- Table structure for table `lesson_mcq`
--

CREATE TABLE `lesson_mcq` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_option` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lesson_mcq`
--

INSERT INTO `lesson_mcq` (`id`, `lesson_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`) VALUES
(1, 17, 'Which keyword is used for conditional branching in Python?', 'if', 'for', 'while', 'switch', 'A'),
(2, 17, 'What is the correct syntax for an if statement?', 'if condition {}', 'if condition:', 'if(condition)', 'if: condition', 'B'),
(3, 17, 'Which block executes when no condition matches?', 'while', 'else', 'elif', 'loop', 'B'),
(4, 17, 'What does elif represent?', 'Else If', 'End Loop', 'Else Loop', 'End If', 'A'),
(5, 17, 'Which operator is used for comparison?', '=', '==', '===', ':=', 'B'),
(6, 18, 'Which keyword defines a function?', 'define', 'function', 'def', 'func', 'C'),
(7, 18, 'What is returned when no return statement is written?', '0', 'None', 'Null', 'Empty', 'B'),
(8, 18, 'Parameters are declared in?', 'Function call', 'Function definition', 'Loop body', 'Input()', 'B'),
(9, 18, 'Arguments are passed in?', 'Function definition', 'Return statement', 'Function call', 'Loop', 'C'),
(10, 18, 'Which symbol is mandatory after function definition?', ':', ';', '.', ',', 'A'),
(11, 19, 'Lists are defined using?', '()', '[]', '{}', '<>', 'B'),
(12, 19, 'Lists in Python are?', 'Immutable', 'Mutable', 'Constant', 'Deleted', 'B'),
(13, 19, 'Indexing in Python starts from?', '-1', '0', '1', 'None', 'B'),
(14, 19, 'Which method adds an item?', 'insert()', 'add()', 'put()', 'append()', 'D'),
(15, 19, 'Which removes value by name?', 'pop()', 'delete()', 'remove()', 'clear()', 'C'),
(16, 20, 'Tuples are defined using?', '[]', '{}', '()', '<>', 'C'),
(17, 20, 'Tuples are?', 'Mutable', 'Editable', 'Immutable', 'Temporary', 'C'),
(18, 20, 'Which function converts tuple to list?', 'tuple()', 'convert()', 'list()', 'arr()', 'C'),
(19, 20, 'Which operator joins tuples?', '+', '*', '&', '/', 'A'),
(20, 20, 'len() gives?', 'length', 'weight', 'width', 'range', 'A'),
(21, 21, 'Dictionaries are written using?', '{}', '[]', '()', '<>', 'A'),
(22, 21, 'Dictionary stores data as?', 'Indexes', 'Key-Value pairs', 'Lists', 'Tuples', 'B'),
(23, 21, 'Which method removes all items?', 'delete()', 'remove()', 'clear()', 'pop()', 'C'),
(24, 21, 'To get only keys?', 'keys()', 'get()', 'items()', 'pop()', 'A'),
(25, 21, 'To access a value safely?', 'print()', 'get()', 'find()', 'pop()', 'B'),
(26, 1, 'Who created Python?', 'Dennis Ritchie', 'Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup', 'B'),
(27, 1, 'Python was released in?', '1990', '1991', '1989', '2000', 'B'),
(28, 1, 'Python is a _____ language.', 'Low Level', 'High Level', 'Machine Level', 'Hardware Level', 'B'),
(29, 1, 'Python code is easy because of?', 'Complex Syntax', 'Readable Syntax', 'Binary Output', 'Hard Rules', 'B'),
(30, 1, 'Python file extension is?', '.pt', '.py', '.pyth', '.pyt', 'B'),
(31, 2, 'Where can we download Python?', 'google.com', 'python.org', 'github.com', 'windows.com', 'B'),
(32, 2, 'What should be enabled while installing Python?', 'GPU', 'PATH', 'BIOS', 'Drivers', 'B'),
(33, 2, 'How do you check Python version?', 'python -run', 'python --version', 'py(version)', 'version()', 'B'),
(34, 2, 'Which editor is commonly used for Python?', 'VS Code', 'Notepad', 'Excel', 'Calculator', 'A'),
(35, 2, 'What runs Python code?', 'Compiler', 'Interpreter', 'Browser', 'Debugger', 'B');

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `level_number` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `level_number`, `title`) VALUES
(1, 1, 'Beginner'),
(2, 2, 'Basics'),
(3, 3, 'Intermediate'),
(4, 4, 'Advanced'),
(5, 5, 'Expert');

-- --------------------------------------------------------

--
-- Table structure for table `mcq_results`
--

CREATE TABLE `mcq_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `problem_results`
--

CREATE TABLE `problem_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `problem_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, NULL, 'admin@gmail.com', '$2b$10$Ckj2LDRSO3KEt/aM6zaFhOcD.0cSmj8.6qrYmdFiGk5JrdsIrjpOa', '2025-11-23 13:30:48'),
(2, 'Sandhosh G', 'santhoshgowravan@gmail.com', '$2b$10$NEGy53Y80bEJmFVgwAYT2ubSKR/qe5EePD8LmBIM9PU7K6znAMLTi', '2025-11-23 13:44:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `lesson_mcq`
--
ALTER TABLE `lesson_mcq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mcq_results`
--
ALTER TABLE `mcq_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `problem_results`
--
ALTER TABLE `problem_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `problem_id` (`problem_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `lesson_mcq`
--
ALTER TABLE `lesson_mcq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mcq_results`
--
ALTER TABLE `mcq_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problem_results`
--
ALTER TABLE `problem_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`);

--
-- Constraints for table `lesson_mcq`
--
ALTER TABLE `lesson_mcq`
  ADD CONSTRAINT `lesson_mcq_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Constraints for table `mcq_results`
--
ALTER TABLE `mcq_results`
  ADD CONSTRAINT `mcq_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `mcq_results_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Constraints for table `problem_results`
--
ALTER TABLE `problem_results`
  ADD CONSTRAINT `problem_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `problem_results_ibfk_2` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
