---
subject: oop
subject_name: "Object Oriented Programming"
subject_code: PBCST304
module: 2
title: "Module 2"
source_type: notes
status: ready
needs_review: false
topics:
  - "Polymorphism"
  - "Method Overloading"
  - "Returning Objects"
  - "Recursion"
  - "Static Members"
  - "Final Variables"
  - "Inheritance"
  - "Super Class"
  - "Sub Class"
  - "Types Of Inheritance"
  - "The Super Keyword"
  - "Protected Members"
  - "Method Overriding"
  - "Add(x,y) 3+2 Adding Two Numbers"
  - "Add(s1+s2) Ann + Maria Concatenates Two Strings"
  - "Add(doc1, Doc2) Merges Two Documents"
  - "Two Types"
  - "Runtime Polymorphism"
  - "Compile Time Polymorphism (method Overloading)"
  - "Runtime Polymorphism (method Overriding)"
  - "Example: Class Over"
  - "Output"
  - "Box()"
  - "Box(double Len)"
  - "Box B2 = New Box();"
  - "Argument Passing"
  - "Test(int I)"
  - "System.out.println(\"object Parameter\");"
  - "System.out.println(\"lnteger Parameter\");"
  - "Object Parameter"
  - "Before Call: 15"
  - "After Call: 15"
  - "Person(person P) // Copy Constructor"
  - "Alice"
  - "System.out.println(p2.name);"
  - "System.out.println(p2.age);"
  - " Any Objects Class Test"
  - "Test Incrbyten()"
  - "Test Ob2= Ob1.incrbyten();"
  - "Disadvantages"
  - "Advantage"
  - "Static Variables"
  - "Student(int R, String N)"
  - "Output 111 Amy Vjc"
  - "Anu Vjc"
  - "Static Method"
  - "Syntax: Classname.methodname(args)"
  - "Example Class Abc"
  - "{ Abc.callme();"
  - "System.out.println(\"b = \" + Abc.b)"
  - "Static Block"
  - "Example: Class Staticblock"
  - "{ System.out.println(\"static Block Ends\");"
  - "Ooutput"
  - "Static Nested Class"
  - "{ Class Inner"
  - "Single Inheritance"
  - "Multiple Inheritance"
  - "Example: Class A"
  - "System.out.println(\"class A”); Class B Extends A"
  - "System.out.println(\"class B”); Public Class C"
  - "Output: Class B Class A"
  - "{ System.out.println(\"class B”); Class C Extends A"
  - "{ System.out.println(\"class C”); Public Class D"
  - "C Obj2 = New C();"
  - "Obj1.displayb();"
  - "Obj1.displaya(); Obj2.displayc(); Obj2.displaya();"
  - "Output: Class B Class A Class C Class A"
  - "{ System.out.println(\"class B”); Class C Extends B"
  - "Output: Class C Class B Class A"
  - "{ System.out.println(\"constructor A\");"
  - "A(int X)"
  - "System.out.println(\"a=\"+x); Class B Extends A"
  - "System.out.println(\"constructor B\");"
  - "System.out.println(\"b=\"+y); Public Class Abc"
  - "{ System.out.println(\"obj1:\");"
  - "B Obj1 = New B();"
  - "System.out.println(\"\\nobj2:\");"
  - "B Obj2 = New B(10,20);"
  - "Output: Obj1"
  - "Constructor A"
  - "Constructor B Obj2: A=10 B=20"
  - "Box(box Ob)"
  - "Boxweight(boxweight Ob)"
  - "Boxweight()"
  - "Boxweight Mybox2 = New Boxweight();"
  - "Example : Class A"
  - "Shipping Cost: $3.41"
  - "Shipping Cost: $1.28"
  - "{ A()"
  - "{ System.out.println(\"inside A's Constructor.\");"
  - "Inside A’s Constructor"
  - "{ B()"
  - "{ System.out.println(\"inside B's Constructor.\"); Class C Extends B"
  - "{ C()"
  - "{ System.out.println(\"inside C's Constructor.\"); Class Callingcons"
  - "Inside B’s Constructor"
  - "Inside C’s Constructor"
  - "Types Of Access Modifiers In Java: A. Private"
  - "Outside The Package(subclass)"
  - "System.out.println(obj.number); Obj.display();"
  - "Inside Display"
  - "{ System.out.println(\"default Method In Parent\");"
  - "// System.out.println(p.message); // Error"
  - "{ System.out.println(\"inside A's Callme Method\"); Class B Extends A"
  - "{ System.out.println(\"inside B's Callme Method\");"
  - "B B = New B();"
  - "C C = New C();"
  - "Output: Inside A’s Callme Method"
  - "Inside B’s Callme Method"
  - "Inside C’s Callme Method Final Variables"
  - "Example: Class Demo"
  - "Demo()"
  - "System.out.println(x);"
  - "System.out.println(num); Final Methods"
  - "{ System.out.println(\"final Method In A\");"
  - "Class B Extends A"
  - "{ System.out.println(\"some Sound\");"
---
# Module 2: Polymorphism and Inheritance

<!-- Source: OOPS Module 2 ktunotes.live(1)-KTUNOTES.LIVE.pdf -->

<!-- page: 1 -->
<!-- page: 2 -->

## Topic: Polymorphism

## Topic: Method Overloading

## Topic: Returning Objects

## Topic: Recursion

## Topic: Static Members

## Topic: Final Variables

## Topic: Inheritance

## Topic: Super Class

## Topic: Sub Class

## Topic: Types Of Inheritance

## Topic: The Super Keyword

## Topic: Protected Members

## Topic: Method Overriding

## Topic: Polymorphism

Polymorphism means “many forms”. In Java, it allows an object to behave in multiple ways depending on the context.
Example: The method name Add in different forms:

## Topic: Add(x,y) 3+2 Adding Two Numbers

## Topic: Add(s1+s2) Ann + Maria Concatenates Two Strings

3. Add (Image, Doc) ----- Pastes image into document.

## Topic: Add(doc1, Doc2) Merges Two Documents

Here, all methods are named Add, but they perform different actions based on their parameters. This is method overloading, where the method name is the same, but the parameter list is different.

## Topic: Two Types

## Topic: Runtime Polymorphism

## Topic: Compile Time Polymorphism (method Overloading)

Compile-time polymorphism means that the method to be executed is determined at compile time
— before the program runs. This happens through method overloading.

## Topic: Runtime Polymorphism (method Overriding)

Runtime polymorphism means that the method to be called is determined at runtime, not at compile time. It is achieved through method overriding using inheritance and dynamic method dispatch.
<!-- page: 3 -->

## Topic: Method Overloading

- It is possible to define two or more methods with the same name within the same class, but their parameter declarations should be different. This is called method overloading.
- This is a form of compile-time polymorphism.
- Overloaded methods must differ in t he type, number of their parameters, and/or return types. When an overloaded method is invoked, Java uses the type, number of parameters, and/or return types to determine which version of the overloaded method to call.

## Topic: Example: Class Over

{ void test()
{ System.out.println("Empty"); void test(double a)
{ System.out.println("a=" + a); void test(int a, int b)
{ System.out.println("a =" +a);
System.out.println("b =" +b); public static void main(String args[])
{ Over ob = new Over(); ob.test(); ob.test(10.5); ob.test(2, 5); ob.test(3);

## Topic: Output

Empty a=10.5 a =2 b =5 a=3.0
Here, test( ) is overloaded three times. The first version test() takes no parameters, the second test(double a) takes one double parameter the third test(int a, int b) takes two integer parameters.
When an overloaded method is called, Java looks for a match between the arguments used to call the method and the method's parameters. This match need not always be exact. Exact match is preferred, but if it’s not found, Java will try automatic type conversion (like int → long, float → double) to resolve the method call. This process is known as Overload Resolution.

Constructors can be overloaded. A class can have any number of constructors -one default constructor and many parameterized constructors class Box
{ double width, height, depth;
Box(double w, double h, double d)
{ width = w; height = h; depth = d;

## Topic: Box()

{ width = -1; height = -1; depth = -1;
<!-- page: 4 -->

## Topic: Box(double Len)

{ width = height = depth = len; double volume()
{ return width * height * depth; class OverloadCons
{ Box b1 = new Box(10, 20, 15);

## Topic: Box B2 = New Box();

Box b3 = new Box(7); double vol; vol = b1.volume(); // get volume of first box
System.out.println("Volume of b1 is " + vol); vol = b2.volume(); // get volume of second box
System.out.println("Volume of b2 is " + vol); vol = b3.volume(); // get volume of cube
System.out.println("Volume of b3 is " + vol);

## Topic: Output

Volume of b2 is -1.0
Eg: The Box class has no default constructor. So error occurs class Box
{ double width; double length; double height;
Box(double w, double l,double h)
{ this.width = w; this.length = l; this.height = h; class BoxDemo
{ Box mybox1 = new Box(); //ERROR
Box mybox2 = new Box(3, 6, 2);
<!-- page: 5 -->

## Topic: Argument Passing

1. call-by-value
In call-by-value, a copy of the actual value is passed to the method. The method works with its local copy. Changes made inside the method do not affect the original variable. class Test
{ void meth(int i, int j)
{ i *= 2; j /= 2; class CallByValue
{ Test ob = new Test(); int a = 15, b = 20;
System.out.println("a and b before call: " + a + " " + b); ob.meth(a, b);
System.out.println("a and b after call: " + a + " " + b);
Output : a and b before call: 15 20 a and b after call: 15 20
The operations that occur inside meth( ) have no effect on the values of a and b used in the call.
2. call-by-reference (Using Objects as Parameters)
{ int a, b;
Test(int i, int j)
{ a = i; b = j; void meth(Test o)
{ o.a *= 2; o.b /= 2; class CallByRef
{ Test ob = new Test(15, 20);
System.out.println("ob.a and ob.b before call: " + ob.a + " " + ob.b); ob.meth(ob);
System.out.println("ob.a and ob.b after call: " + ob.a + " " + ob.b);
<!-- page: 6 -->

Output: ob.a and ob.b before call: 15 20 ob.a and ob.b after call: 30 10
Example: Call by value and call by reference class Test
{ int a;

## Topic: Test(int I)

{ a=i; void calc(Test o)
{ o.a *= 2; void calc(int a)
{ a=a*2; class ObCall
{ Test ob = new Test(15);

## Topic: System.out.println("object Parameter");

System.out.println("Before call: " + ob.a ); ob.calc(ob); //Call by reference
System.out.println("After call: " + ob.a ); int a=15;

## Topic: System.out.println("lnteger Parameter");

System.out.println("Before call: " + a); ob.calc(a); //Call by value
System.out.println("After call: " + a);

## Topic: Output

## Topic: Object Parameter

## Topic: Before Call: 15

After call: 30 lnteger parameter

## Topic: Before Call: 15

## Topic: After Call: 15

Example: Passing an object to a constructor class Person
{ String name; int age;

## Topic: Person(person P) // Copy Constructor

{ this.name = p.name; this.age = p.age;
Person(String name, int age) // Regular constructor
{ this.name = name; this.age = age;

## Topic: Alice
<!-- page: 7 -->

{ public static void main(String[] args)
{ Person p1 = new Person("Alice", 30);
Person p2 = new Person(p1); // Initialize p2 using p1

## Topic: System.out.println(p2.name);

## Topic: System.out.println(p2.age);

## Topic: Returning Objects

- A method can return
 Any type of Primitive data (int, float, char, double etc.)

## Topic:  Any Objects Class Test

{ int a;

## Topic: Test(int I)

{ a = i;

## Topic: Test Incrbyten()

{ Test temp = new Test(a+10); return temp; class RetOb
{ Test ob1 = new Test(2);

## Topic: Test Ob2= Ob1.incrbyten();

System.out.println("ob1.a: " + ob1.a);
System.out.println("ob2.a: " + ob2.a);
Output ob1.a: 2 ob2.a: 12

## Topic: Recursion

- A method that calls itself is said to be recursive. Java supports recursion.
- Recursion is the process of defining something in terms of itself.
Example : compute the factorial of a number class Factorial
{ int fact(int n) // this is a recursive function
{ int result; if(n==1) return 1; result = fact(n-1) * n; return result;
<!-- page: 8 -->

{ Factorial f = new Factorial();
System.out.println("Factorial of 3 is " + f.fact(3));
Output : Factorial of 3 is 6
When fact( ) is called with an argument of 1, the function returns 1; otherwise it returns the product of fact(n–1)*n. To evaluate this expression, fact( ) is called with n–1. This process repeats until n equals 1, and the calls to the method begin returning.
- When a method calls itself, new local variables and parameters are allocated storage on the stack, and the method code is executed with these new variables from the start.
- A recursive call does not make a new copy of the method. Only the arguments are new.
- As each recursive call returns, the old local variables and parameters are removed from the stack, and execution resumes at the point of the call inside the method.

## Topic: Disadvantages

- Recursive routines may execute a bit more slowly than the iter ative equivalent because of the added overhead of the additional function calls.
- Many recursive calls to a method could cause a stack overrun. Because storage for parameters and local variables is on the stack and each new call creates a new copy of these variables, it is possible that the stack could be exhausted. If this occurs, the Java run-time system will cause an exception.

## Topic: Advantage

- Recursive methods can be used to create clearer and simpler versions of several algorithms than their iterative equivalent.
- Example: QuickSort algorithm is quite difficult to implement iteratively.
- Some problems, especially AI-related ones, seem to lend themselves to recursive solutions.

## Topic: Static Members

Normally, when we define a variable or method in a class, it is associated with an object of that class. You must create an object to access those members. However, when you want a variable or method to be shared among all objects or used without creating any object, you use the keyword static.

## Topic: Static Variables

- A static variable or method can be accessed without creating an object.
Declaration syntax: static type variablename;
- All instances (objects) of the class share the same static variable.
- They can be called as follows: ClassName.variablename;
- Advantage – Makes the program memory efficient.
<!-- page: 9 -->

{ int rollno; // instance variable
String name; // instance variable static String college = "VJC"; // static variable

## Topic: Student(int R, String N)

{ rollno = r; name = n; public class Stu
{ Student s1 = new Student(111, "Amy");
Student s2 = new Student(222, "Anu");
System.out.println(s1.rollno + " " + s1.name + " " + Student.college);
System.out.println(s2.rollno + " " + s2.name + " " + Student.college);

## Topic: Output 111 Amy Vjc

## Topic: Anu Vjc

## Topic: Static Method

- Static methods are the methods in Java that can be called without creating an object of a class.

## Topic: Syntax: Classname.methodname(args)

- The most common example of a static method is main( ). The main() method is static because it is called before any objects are created.
- Static methods cannot access non-static (instance) members directly.
- Properties of a static method: o They can only call other static methods. o They must only access static data. o They cannot refer to this or super in any way. o It is illegal to refer to any instance variables inside a static method.

## Topic: Example Class Abc

{ static int a = 42, b = 99; static void callme()
{ System.out.println("a = " + a); class X

## Topic: { Abc.callme();

## Topic: System.out.println("b = " + Abc.b)

Output : a = 42 b = 99
<!-- page: 10 -->

- An instance method can access the instance methods, instance variables , static methods, and static variables directly.
- Static methods can access the static variables and static methods directly.
- Static methods can’t access instance methods and instance variables directly.

## Topic: Static Block

- A static block is a block of code that is used to initialize static variables.
- It runs once when the class is first loaded, even before the main() is called.
- Synatx: static {
// initialization code

## Topic: Example: Class Staticblock

{ static int a = 3; // static variable static int b; // static variable static void meth(int x)
{ System.out.println("x = " + x);
System.out.println("a = " + a);
System.out.println("b = " + b); static // First static block
{ System.out.println("Static block initialized."); b = a * 4; public static void main(String args[])
{ meth(42); static // Second static block

## Topic: { System.out.println("static Block Ends");

## Topic: Ooutput

StSatic block Ends x = 42 a = 3 b = 12

- A class within another class is known as nested class.
- A nested class has access to the members, including private members, of the class in which it is nested. However, the enclosing class does not have access to the members of the nested class.
- There are two types of nested classes: o Static Nested Class o Non-static Nested Class(Inner Class)
<!-- page: 11 -->

## Topic: Static Nested Class

- A static nested class is one which has the static modifier applied.
- It cannot refer to members of its enclosing class directly. It must access the members of its enclosing class through an object.
Example: construct the inner class object and call the method in it public class Outer
{ static class Inner
{ public void print()
{ System.out.println("This is my nested class"); public static void main(String args[])
{ Outer.Inner obj = new Outer.Inner(); // Creating object obj.print();
Output: This is my nested class
Non-static nested class(Inner class)
- It has access to all of the variables and methods of its outer class and may refer to them directly in the same way that other non-static members of the outer class do. Thus, an inner class is fully within the scope of its enclosing class.

## Topic: { Class Inner

{ public void print()
{ System.out.println("This is my inner class"); public static void main(String args[])
{ Outer.Inner obj = new Outer().new Inner(); // Creating object obj.print();
Output: In a nested class method
Example: Construct the object of the Outer class and call the Inner class method using the Inner class object.
// Demonstrate an inner class. class Outer
{ int outer_x = 100; void test()
{ Inner obj = new Inner(); obj.display();
<!-- page: 12 -->

{ void display()
{ System.out.println("display: outer_x = " + outer_x); class InnerClassDemo
{ Outer outer = new Outer(); outer.test();
Output : display: outer_x = 100
Inner is defined within the scope of class Outer. Therefore, any code in class Inner can directly access the variable outer_x. A nested class can also be defined within the block defined by a method or even within the body of a for loop. Nested classes are helpful when handling events in an applet.
So far, we have seen the method of defining an inner class as a member of an outer class. But, in java an inner class can be defined inside a method, that is, in a block scope.
For example, a class can be defined within a method, a for loop, or an if block. This is called a local inner class. The scope of these will be within that block — just like a function. class Outer
{ int outer_x = 100; // non-static variable void test()
{ for(int i=0; i<5; i++)

## Topic: { Class Inner

{ void display()
{ outer_x++; // Increment the value
System.out.println("display: outer_x = " + outer_x);
Inner inner = new Inner(); //Inner object inner.display(); // Call display() multiple times class InnerClassDemo1
{ Outer outer = new Outer(); // Outer object outer.test();
Output : display: outer_x = 101
<!-- page: 13 -->

## Topic: Inheritance

- The mechanism of deriving a new class from an old class is called Inheritance.
- The old class is known as the base class(or super class or parent class) , and the new one is called the subclass (or derived class or child class).
- A subclass is a specialized version of a superclass. It inherits all possible instance variables and methods defined by the superclass and adds its own, unique elements.
- To inherit a class, we should use the keyword extends.
- General form: class subclass-name extends superclass-name
{
// body of class class A // A is a superclass.
{ int i, j; void showij()
{ System.out.println("i and j: " + i + " " + j); class B extends A // Create a subclass by extending class A.
{ int k; void showk()
{ System.out.println("k: " + k); void sum()
{ System.out.println("i+j+k: " + (i+j+k)); class C
{ A obj1 = new A();
B obj2 = new B(); obj1.i = 10; obj1.j = 20;
System.out.print("Contents of obj1: "); obj1.showij();
// The subclass has access to all public members of its superclass. obj2.i = 7; obj2.j = 8; obj2.k = 9;
System.out.print ("Contents of obj2: ");
<!-- page: 14 -->

System.out.print ("Sum of i, j and k in obj2: "); subOb.sum();
Output: Contents of obj1: i and j: 10 20
Contents of obj2: i and j: 7 8 k: 9
Sum of i, j and k in obj2: i+j+k: 24
Here the subclass B includes all of the members of its superclass, A.
- Inheritance may take several forms:

## Topic: Single Inheritance

## Topic: Multiple Inheritance

4. Multilevel Inheritance o Single Inheritance: Only one super class and one derived class

## Topic: Example: Class A

{ void displayA()
{

## Topic: System.out.println("class A”); Class B Extends A

{ void displayB()
{

## Topic: System.out.println("class B”); Public Class C

{ B obj = new B(); obj.displayB(); obj.displayA();

## Topic: Output: Class B Class A
<!-- page: 15 -->

## Topic: { System.out.println("class B”); Class C Extends A

{ void displayC()

## Topic: { System.out.println("class C”); Public Class D

{ B obj1 = new B();

## Topic: C Obj2 = New C();

## Topic: Obj1.displayb();

## Topic: Obj1.displaya(); Obj2.displayc(); Obj2.displaya();

## Topic: Output: Class B Class A Class C Class A
<!-- page: 16 -->

## Topic: { System.out.println("class B”); Class C Extends B

{ void displayC()

## Topic: { System.out.println("class C”); Public Class D

{ C obj = new C(); obj.displayC(); obj.displayB(); obj.displayA();

## Topic: Output: Class C Class B Class A

A class member that has been declared as private will remain private to its class. It is not accessible by any code outside its class, including subclasses.
/* This program contains an error and will not compile. */ class A
{ int i; // public by default private int j; // private to A void setij(int x, int y)
{ i = x; j = y;
<!-- page: 17 -->

{ int total; void sum()
{ total = i + j; // ERROR, j is not accessible here class C
{ B obj = new B(); obj.setij(10, 12); obj.sum();
System.out.println("Total is " + obj.total);
This program will not compile because the reference to j inside the sum( ) method of B causes an access violation. Since j is declared as private, it is only accessible by other members of its own class. Subclasses have no access to it.
- Super keyword o Whenever a subclass needs to refer to its immediate superclass, we can use the keyword super. o super is used in the following two situations
 To call the superclass’s constructor
 To access a member of the superclass that has been hidden by a member of a subclass. o Using super to Call Superclass Constructors
 A subclass can call a constructor method defined by its immediate superclass by using super().
 super( ) must always be the first statement executed inside a subclass’s constructor.
 General form: super(parameter-list); class A
{ int a;
A()

## Topic: { System.out.println("constructor A");

## Topic: A(int X)

{ a=x;

## Topic: System.out.println("a="+x); Class B Extends A

{ int b;
B()
{ //by default, the child class calls the parent class's default constructor

## Topic: System.out.println("constructor B");
<!-- page: 18 -->

B(int x, int y)
{ super(x); b=y;

## Topic: System.out.println("b="+y); Public Class Abc

## Topic: { System.out.println("obj1:");

## Topic: B Obj1 = New B();

## Topic: System.out.println("\nobj2:");

## Topic: B Obj2 = New B(10,20);

## Topic: Output: Obj1

## Topic: Constructor A

## Topic: Constructor B Obj2: A=10 B=20

Example : super( ) can be called using any form defined by the superclass. The constructor executed will be the one that matches the arguments class Box
{ private double width, height, depth;

## Topic: Box(box Ob)

{ width = ob.width; height = ob.height; depth = ob.depth;
Box(double w, double h, double d)
{ width = w; height = h; depth = d;

## Topic: Box()

{ width = height = depth = -1;

## Topic: Box(double Len)

{ width = height = depth = len; double volume()
{ return width * height * depth; class BoxWeight extends Box
{ double weight;
<!-- page: 19 -->

## Topic: Boxweight(boxweight Ob)

{ super(ob); weight = ob.weight;
BoxWeight(double w, double h, double d, double m)
{ super(w, h, d); // call superclass constructor weight = m;

## Topic: Boxweight()

{ super(); weight = -1;
BoxWeight(double len, double m)
{ super(len); weight = m; class DemoSuper
{ BoxWeight mybox1 = new BoxWeight(10, 20, 15, 34.3);

## Topic: Boxweight Mybox2 = New Boxweight();

BoxWeight mycube = new BoxWeight(3, 2);
BoxWeight myclone = new BoxWeight(mybox1); double vol = mybox1.volume();
System.out.println("Volume of mybox1 is " + vol);
System.out.println("Weight of mybox1 is " + mybox1.weight); vol = mybox2.volume();
System.out.println("Volume of mybox2 is " + vol);
System.out.println("Weight of mybox2 is " + mybox2.weight); vol = myclone.volume();
System.out.println("Volume of myclone is " + vol);
System.out.println("Weight of myclone is " + myclone.weight); vol = mycube.volume();
System.out.println("Volume of mycube is " + vol);
System.out.println("Weight of mycube is " + mycube.weight);
Output: Volume of mybox1 is 3000.0
Volume of mybox2 is -1.0
Weight of mybox2 is -1.0
<!-- page: 20 -->

 General form: super.member
 Here, member can be either a method or an instance variable.
 This is most applicable to situations in which member names of a subclass hide members by the same name in the superclass.

## Topic: Example : Class A

{ int i; void show()
{ System.out.println("i in class A: " + i); class B extends A
{ int i; // this i hides the i in A
B(int a, int b)
{ super.i = a; // i in class A i = b; // i in class B void show()
{ super.show(); //call show() of class A
System.out.println("i in superclass: " + super.i);
System.out.println("i in subclass: " + i); class UseSuper
{ B subOb = new B(1, 2); subOb.show();
Output : i in class A: 1 i in superclass: 1 i in subclass: 2
Example : Multilevel inheritance and super() class Box
{ private double width, height, depth;
Box(double w, double h, double d)
{ width = w; height = h; depth = d; double volume()
{ return width * height * depth;
<!-- page: 21 -->

{ double weight;
BoxWeight(double w, double h, double d, double m)
{ super(w, h, d); weight = m; class Shipment extends BoxWeight
{ double cost;
Shipment(double w, double h, double d, double m, double c)
{ super(w, h, d, m); cost = c; class DemoShipment
{ Shipment shipment1 = new Shipment(10, 20, 15, 10, 3.41);
Shipment shipment2 = new Shipment(2, 3, 4, 0.76, 1.28); double vol = shipment1.volume();
System.out.println("Volume of shipment1 is " + vol);
System.out.println("Weight of shipment1 is " + shipment1.weight);
System.out.println("Shipping cost: $" + shipment1.cost); vol = shipment2.volume();
System.out.println("Volume of shipment2 is " + vol);
System.out.println("Weight of shipment2 is " + shipment2.weight);
System.out.println("Shipping cost: $" + shipment2.cost);
Output : Volume of shipment1 is 3000.0

## Topic: Shipping Cost: $3.41

## Topic: Shipping Cost: $1.28

Calling Order of Constructors o "Calling Order of Constructors" refers to the specific sequence in which constructors are invoked when an object is created, o In a class hierarchy, constructors are called in order of derivation, from superclass to subclass. o If super( ) is not used, then the default(parameterless) constructor of each superclass will be executed. class A

## Topic: { A()

## Topic: { System.out.println("inside A's Constructor.");

## Topic: Inside A’s Constructor
<!-- page: 22 -->

## Topic: { B()

## Topic: { System.out.println("inside B's Constructor."); Class C Extends B

## Topic: { C()

## Topic: { System.out.println("inside C's Constructor."); Class Callingcons

{ C c = new C();

## Topic: Inside B’s Constructor

## Topic: Inside C’s Constructor

## Topic: Protected Members

Access modifiers in Java are keywords used to set the visibility or accessibility of classes, methods, constructors, and variables. They control how the members of a class can be accessed from other classes or packages.

## Topic: Types Of Access Modifiers In Java: A. Private

- These are accessible only within the same class. b. default (no modifier)
- When no modifier is specified, it is known as package-private or default access.
- Members are accessible to any class in the same package. c. protected
- The protected access modifier allows access: o Within the same class. o Within the same package o In subclasses even if they are in different packages d. public
- The public modifier allows the member to be accessible from anywhere — from any class and package
- This method can be accessed from any other class in any package

## Topic: Outside The Package(subclass)

Outside the package public Yes Yes Yes Yes protected Yes Yes Yes (Only to derived classes) No default Yes Yes No No private Yes No No No
<!-- page: 23 -->

- Protected within the same class. public class ProtectedSample
{ protected int number = 42; protected void display()
{ System.out.println("Inside display"); public static void main(String[] args)
{ ProtectedSample obj = new ProtectedSample();

## Topic: System.out.println(obj.number); Obj.display();

## Topic: Inside Display

- Protected within the same package class ProtectedSample
{ protected int number = 42; protected void display()
{ System.out.println("Inside display"); public class ABC
{ public static void main(String[] args)
{ ProtectedSample obj = new ProtectedSample();

## Topic: Inside Display

- In subclasses if they are in different packages
A protected member is accessible in subclasses outside the package only through inheritance, not through object reference. package mypack; public class Parent
{ protected String message = "Hello from Parent"; protected void showMessage()
{ System.out.println("Protected method in Parent"); void show()

## Topic: { System.out.println("default Method In Parent");
<!-- page: 24 -->

{ public void accessProtected()
{ System.out.println(message); showMessage(); public static void main(String[] args)
{ Child obj = new Child(); obj.accessProtected();
// Below is NOT allowed: accessing protected members via Parent object
// Parent p = new Parent();

## Topic: // System.out.println(p.message); // Error

// p.showMessage(); // Error
Method Overriding o In a class hierarchy, when a method in a subclass has the same name and type signature as a method in its superclass, then the method in the subclass is said to override the method in the superclass. o When an overridden method is called from within a subcl ass, it will always refer to the subclass version of that method. The version of the method defined by the superclass will be hidden. class A
{ int i, j;
A(int a, int b)
{ i = a; j = b; void show()
{ System.out.println("i and j: " + i + " " + j); class B extends A
{ int k;
B(int a, int b, int c)
{ super(a, b); k = c; void show() // this overrides show() in A
{ System.out.println("k: " + k); class Override
<!-- page: 25 -->

{ B subOb = new B(1, 2, 3); subOb.show(); // this calls show() in B
Output : k: 3 o By using super we can access the superclass version of an overridden function. class A
{ int i, j;
A(int a, int b)
{ i = a; j = b; void show()
{ System.out.println("i and j: " + i + " " + j); class B extends A
{ int k;
B(int a, int b, int c)
{ super(a, b); k = c; void show()
{ super.show(); // this calls A's show()
System.out.println("k: " + k); class Override
{ B subOb = new B(1, 2, 3); subOb.show(); // this calls show() in B output: i and j: 1 2 k: 3 o Method overriding occurs only when the names and the type signatures of the two methods are identical. If they are not, then the two methods are simply overloaded. class A
{ int i, j;
A(int a, int b)
{ i = a; j = b; void show()
{ System.out.println("i and j: " + i + " " + j);
<!-- page: 26 -->

{ int k;
B(int a, int b, int c)
{ super(a, b); k = c; void show(String msg)
{ System.out.println(msg + k); class Override
{ B subOb = new B(1, 2, 3); subOb.show("This is k: "); // this calls show() in B subOb.show(); // this calls show() in A
Output: This is k: 3 i and j: 1 2
The version of show( ) in B takes a string parameter. This makes its type signature different from the one in A, which takes no parameters. Therefore, no overriding takes place.
Dynamic Method Dispatch o Java implements run-time polymorphism by using Dynamic method dispatch. o In this mechanism, method overridding is resolved at run time, rather than compile time. Hence it is an example for run-time polymorphism. o When superclass reference variable refers to Child class object, it is known as Upcasting. In
When an overridden method is called through a superclass reference, Java determines which version of that method to execute based upon the type of the object being referred to at the time the call occurs. class A
{ void callme()

## Topic: { System.out.println("inside A's Callme Method"); Class B Extends A

{ void callme()

## Topic: { System.out.println("inside B's Callme Method");
<!-- page: 27 -->

{ void callme()
{ System.out.println("Inside C's callme method"); public class Dispatch
{ A a = new A();

## Topic: B B = New B();

## Topic: C C = New C();

A r; // obtain a reference of type A r = a; // r refers to an A object r.callme(); // calls A's version of callme r = b; // r refers to a B object r.callme(); // calls B's version of callme r = c; // r refers to a C object r.callme(); // calls C's version of callme

## Topic: Output: Inside A’s Callme Method

## Topic: Inside B’s Callme Method

## Topic: Inside C’s Callme Method Final Variables

- Final variables are constants. Its value can never be changed.
- The value of a final variable must be initialized, either when it's declared or in the constructor of the class.

## Topic: Example: Class Demo

{ final int MAX_VALUE = 100; // final variable initialized final int MIN_VALUE;

## Topic: Demo()

{ MIN_VALUE = 0; // assigning in constructor void show()
{ System.out.println("MAX_VALUE = " + MAX_VALUE);
System.out.println("MIN_VALUE = " + MIN_VALUE); o It is a common coding convention to choose all uppercase identifiers for final fields. o Both method parameters and local variables can be declared final. o Declaring a parameter final prevents it from being changed within the method.
Example: Can’t modify final parameters inside the method void printValue(final int x)
{
<!-- page: 28 -->

// x = x + 1; // ❌ Error! Cannot modify a final parameter

## Topic: System.out.println(x);

Example: Can’t modify local final variable inside the method class Demo
{ void show()
{ final int num = 10;
// num = 20; ❌ Error

## Topic: System.out.println(num); Final Methods

- A final method cannot be overridden in a subclass.
- If we wish to prevent the subclasses from overriding the members of the super class, we can declare them as final in its super class using the keyword final. class A
{ final void show()

## Topic: { System.out.println("final Method In A");

## Topic: Class B Extends A

{
// void show() { } // ❌ Error: Cannot override final method
Because show( ) is declared as final, it cannot be overridden in B. If you attempt to do so, a compile-time error will result.
- Java resolves calls to methods dynamically, at run time. This is called late binding.
- final methods cannot be overridden. So a call to final method can be resolved at compile time. This is called early binding. final class
- A final class cannot be inherited. To do this, precede the class declaration with final.
- Declaring a class as final implicitly declares all of its methods as final, too.
- It is illegal to declare a class as both abstract and final since an abstract class is incomplete by itself and relies upon its subclasses to provide complete implementations. final class Animal
{ void sound()

## Topic: { System.out.println("some Sound");

// class Dog extends Animal { } ❌ Error
<!-- page: 29 -->
