---
subject: "Object Oriented Programming"
subject_code: "CODE_UNKNOWN"
branch: "Unknown"
semester: 3
module: null
source_type: "notes"
status: "draft"
original_file: "constructors-KTUNOTES.LIVE.pdf"
original_path: "S3/OBJECT ORIENTED PROGRAMMING/constructors-KTUNOTES.LIVE.pdf"
content_hash: "fdd14071be43a811226c105dcf1ed899f20f0edeedd8cc18d35a590eec521211"
extraction_quality: "fair"
needs_review: true
contains_figures: false
contains_equations: true
contains_diagrams: false
diagram_needs_review: false
equation_needs_review: true
table_needs_review: false
---

# Unmapped Module: Module Title Needs Review

<!-- page: 1 -->
## Topic: Extracted Notes
w e b s i t e f o r m o r e m a t e r i a l s
O U R T E L E G R A M C H A N N E L f o r n o t e s a n d d i s c u s s i o n a n d u p d a t e s
S C A N T H E Q R C O D E S
K T U N O T E S . L I V E

## Topic: 0 2 4 S C H E M E
F o r W h a t s A p p g r o u p j o i n o u r W h a t s A p p g r o u p g e t i n t o o u r w e b s i t e
C L I C K T H E L O G O T O J O I N
O U R W H A T S A P P G R O U P f o r n o t e u p d a t e s a n d n o t i f i c a t i o n s
O U R W E B S I T E g e t i n a n d d o w n l o a d a l l 2 0 2 4 m a t e r i a l s

<!-- page: 2 -->

## Topic: Constructors

<!-- page: 3 -->
● A constructor in Java is a special method used to initialize objects when they are created.
● It has the same name as the class and no return type, not even void.

## Topic: Syntax: Class Classname {

## Topic: Classname() {
// constructor body

<!-- page: 4 -->

## Topic: Types Of Constructors

## Topic: Default Constructor
• Provided by the compiler if no constructor is defined.
• Initializes objects with default values. class Car {
Car() { // default constructor

## Topic: System.out.println("default Constructor Called");
Car c1 = new Car(); // calls default constructor

## Topic: } Output: Default Constructor Called

<!-- page: 5 -->

## Topic: Parameterized Constructor
• Accepts arguments to initialize object values. class Student {
String name; int age;
Student(String n, int a) { //Parameterized Constructor name = n; age = a; void display() {
System.out.println(name + " is " + age + " years old."); public class Main {
Student s = new Student("Alice", 20); s.display();
} Output: Alice is 20 years old

<!-- page: 6 -->

## Topic: Copy Constructor
• Copies data from one object to another. class Book {

## Topic: String Title;
Book(String t) { title = t;

## Topic: Book(book B)
// copy constructor
{ title = b.title; void show() {
System.out.println("Title: " + title);

<!-- page: 7 -->
public class Main {

## Topic: Book B1 = New Book("java Programming");
Book b2 = new Book(b1); // copy object b2.show();

## Topic: Output

## Topic: Title: Java Programming

<!-- page: 8 -->
w e b s i t e f o r m o r e m a t e r i a l s
O U R T E L E G R A M C H A N N E L f o r n o t e s a n d d i s c u s s i o n a n d u p d a t e s
S C A N T H E Q R C O D E S
K T U N O T E S . L I V E

## Topic: 0 2 4 S C H E M E
F o r W h a t s A p p g r o u p j o i n o u r W h a t s A p p g r o u p g e t i n t o o u r w e b s i t e
C L I C K T H E L O G O T O J O I N
O U R W H A T S A P P G R O U P f o r n o t e u p d a t e s a n d n o t i f i c a t i o n s
O U R W E B S I T E g e t i n a n d d o w n l o a d a l l 2 0 2 4 m a t e r i a l s
