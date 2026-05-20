---
subject: oop
subject_name: "Object Oriented Programming"
subject_code: PBCST304
module: 3
title: "Module 3"
source_type: notes
status: ready
needs_review: false
topics:
  - "Module Iii"
  - "Packages"
  - "Package Name"
  - "Example: Java.awt.color"
  - "Naming Convention: Java.packagename.classname.methodname()"
  - "Example: Double Y=java.lang.math.sqrt();"
  - "Example: Java.awt.pointpts[];"
  - "System.out.println(“class A”);"
  - "{ System.out.println(“class B”);"
  - "System.out.println(“m=”+m);"
  - "{ Classa Obj1=new Classa();"
  - "Classb Obj2=new Classb(); Obj1.displaya(); Obj2.displayb();"
  - "Output: Class A"
  - "Class B M=10"
  - "Student Student1;// Error Import Package1.classa; Class Test1"
  - "Classa Obj1=new Classa(); Obj1.displaya();"
  - "System.out.println(“m=”+m); Import Package2.classb; Class Classc Extends Classb"
  - "{ System.out.println(“class C”);"
  - "System.out.println(“n=”+n); Class Abc"
  - "Classc Obj=new Classc(); Obj.displayb(); Obj.displayc();"
  - "Output: Class B M=10"
  - "Class C M=10 N=20"
  - "//body Of A"
  - "//body Of B"
  - " Compile B.java File"
  - "Import P1.*;"
  - "X Objectx; //correct"
  - "C:\\myprograms\\java"
  - "Example: // A Simple Package Package Mypack; Class Balance"
  - "System.out.print(\" > \");"
  - "Access Protection"
  - "Interfaces"
  - "Class Interface"
  - "System.out.println(\"bark\");"
  - "System.out.println(\"sleeping\"); Class Dog Extends Animal Void Makesound()"
  - "Body Of Classname"
  - "{ System.out.println(\"sports Wt=\"+sportwt); Void Display()"
  - "System.out.println(\"total Score=\"+total); Class Hybrid"
  - "Output: Roll No: 1234"
  - "Part1= 27.5"
  - "Part2 = 33.0"
  - "Sports Wt=6.0"
  - "Total Score = 66.5 O Partial Implementations"
  - "Body Of Name2"
  - "Exception Handling"
  - "Types Of Errors"
  - "Output: Division By Zero"
  - "Exc1.subroutine(); Class Exc2"
  - "System.out.println(\"after Catch Statement.\");"
  - "System.out.println(\"after Try/catch Blocks.\");"
  - "Input1: Java Multicatch"
  - "After Try/catch Blocks"
  - "Input2: Java Multicatch Hai"
  - " Example : Class Nesttry"
  - "Input1: C:\\>java Nesttry"
  - "Input2: C:\\>java Nesttry One"
  - "Input3: C:\\>java Nesttry One Two"
  - " Syntax : Throw Throwableinstance;"
  - " Example: Class Throwdemo"
  - "Output: Caught: Java.lang.nullpointerexception: Demo"
  - "Output: Caught Inside Demoproc"
  - "Recaught: Java.lang.nullpointerexception: Demo"
  - " Syntax: Try"
  - " Exception"
  - " Error"
  - "Examples: O Outofmemoryerror O Stackoverflowerror O Virtualmachineerror"
  - " Unchecked Exceptions"
  - " Checked Exceptions"
  - "Java’s Unchecked Runtimeexception Subclasses"
  - "Exception Meaning"
  - "Java’s Checked Runtimeexception Subclasses"
  - "Negativeexception(int X)"
  - "{ Scanner Sc=new Scanner(system.in);"
  - "{ System.out.println(e);"
  - "Output : Enter A Number: 12"
  - " Use Case"
  - " Example Public Class Singleton"
  - " Real World Analogy"
  - "Oldprinter Oldprinter = New Oldprinter();"
  - "Printer Printer = New Printeradapter(oldprinter); Printer.print(\"hello Adapter Pattern!\");"
---
# Module 3: Packages, Interfaces, Exceptions, and Design Patterns

<!-- Source: OOPS MODULE 3 ktunotes.live-KTUNOTES.LIVE.pdf -->

<!-- page: 1 -->
<!-- page: 2 -->

## Topic: Module Iii

- Packages o Defining a Package o CLASSPATH o Access Protection o Importing Packages.
- Interfaces o Interfaces v/s Abstract classes o defining an interface o implementing interfaces o accessing implementations through interface references o extending interface(s).
- Exception Handling o Checked Exceptions o Unchecked Exceptions o try Block and catch Clause o Multiple catch Clauses o Nested try Statements o throw o throws o finally o Java Built-in Exceptions o Custom Exceptions
- Introduction to design patterns in Java : Singleton and Adaptor.
<!-- page: 3 -->

## Topic: Packages

- Packages group a variety of classes and/or interfaces together.
- The grouping is done according to functionality.
- Packages allow us to use classes from other programs without physically copying them into the program under development.
- Packages act as containers for classes.
- By organizing classes into packages, we can achieve the following benefits: o The classes contained in the packages of other programs can be easily reused. o The two classes in two different packages can have the same name. They may be referred by their fully qualified name, comprising the package name and the class name. o Packages provide a way to hide classes, thus preventing other programs or packages from accessing classes that are meant for internal use only. o Packages also provide a way for separating design from coding. First, we can design classes and decide their relationships, and then we can implement the Java code needed for the methods. It is possible to change the implementation of any method without affecting the rest of the design.
- Java packages are classified into two types: o Java API Package o User-defined package
- Java API Packages o All of the standard Java classes included with Java are stored in a package called java. o Java API provides large number of classes grouped into different packages according to functionality.

## Topic: Package Name

Contents java.lang Language support classes. They are automatically imported. They include classes for primitive types, strings, math functions, threads and exceptions java.util Language utility classes such as vectors, hash tables, random numbers, date etc. java.io Input/output support classes. They provide facilities for the input and output of data. java.awt Set of classes for implementing GUI. They provide classes for windows, button, lists, menus and so on. java.net Classes for networking. They include classes for communicating with local computers as well as with internet servers java.applet Classes for creating and implementing applets.
<!-- page: 4 -->

3
 Use the fully qualified class name of the class that we want to use

## Topic: Example: Java.awt.color

 Import the package
Syntax 1: import packagename.classname;
Syntax 2: import packagename.*;
These statements are known as import statements and must appear at the top of the file, before any class declarations. import is a keyword.
- Example: import java.awt.Color;
- Example: import java.awt.*;
It brings all classes of java.awt package. o By convention, packages begin with lower-case letters and classes begin with upper-case letters.

## Topic: Naming Convention: Java.packagename.classname.methodname()

## Topic: Example: Double Y=java.lang.math.sqrt();

Here, java and lang are packages, Math is a class, and sqrt is a method inside Math class.

## Topic: Example: Java.awt.pointpts[];

- User Defined Package o First, declare the name of the package using package keyword followed by a package name. o This must be the first statement in the java source file. o Syntax : package pkg; o Any classes declared within that file will belong to the specified package.
<!-- page: 5 -->

4
(body of class)
Here, the package name is firstPackage. The class FirstClass is now considered as a part of this package. This listing should be saved as a file called FirstClass.java, and located in a directory named firstPackege. When the source file is compiled, Java will create a .class file and store it in the same directory. o If we omit the package statement, the class names are put into the default package, which has no name. o Steps to define user-defined packages:
 Declare the package at the beginning of a file using the form package packagename;
 Define the class that is to be put in the package and declare it public. A Java package file can have more than one class definition. In such cases, only one of the classes may be declared public, and that class name with .java extension is the source file name.
 Create a subdirectory under the directory where the main source files are stored.
 Store the listing as the classname.java file in the subdirectory created
 Compile the file. This creates a .class file in the subdirectory. When a source file with more than one class definition is compiled, Java creates independent .class files for those classes. o Java supports the concepts of package hierarchy.
General form: package pkg1[.pkg2[.pkg3]];
Example : package firstPackage.secondPackage;
Store this package in a subdirectory named firstPackage/secondPackage o Syntax for Accessing a User-Defined Package: import package1[.package2][.package3].classname; or import packagename.*;
Here, package1 is the name of the top-level package, package2 is the name of the package that is inside package1, and so on. We can have any number of packages in a package hierarchy. package package1; public class ClassA
{ public void displayA()

## Topic: System.out.println(“class A”);
<!-- page: 6 -->

Consider another package: package package2; public class ClassB
{ Protected int m=10; public void displayB()

## Topic: { System.out.println(“class B”);

## Topic: System.out.println(“m=”+m);

The source file and compiled file of this package are located in the subdirectory package2. import package1.ClassA; import package2; class Test2
{ public static void main(String args[])

## Topic: { Classa Obj1=new Classa();

## Topic: Classb Obj2=new Classb(); Obj1.displaya(); Obj2.displayb();

## Topic: Output: Class A

## Topic: Class B M=10

- When we import multiple packages, it is likely that two or more packages contain classes with identical names. package pack1; public class Student
{……………………….} package pack2; public class Student
{……………………….}
When we import and use these packages like: import pack1.*; import pack2.*;

## Topic: Student Student1;// Error Import Package1.classa; Class Test1

{ public static void main(String args[])

## Topic: Classa Obj1=new Classa(); Obj1.displaya();
<!-- page: 7 -->

Since both packages contain the class Student, the compiler cannot understand which one to use and generates an error. To overcome these types of errors, use the following code. import pack1.*; import pack2.*; pack1.Student Student1; pack2.Student Student2;
- It is possible to subclass a class that has been imported from another package. package package2; public class ClassB
{ protected int m=10; public void displayB()

## Topic: System.out.println(“m=”+m); Import Package2.classb; Class Classc Extends Classb

{ int n=20; void displayC()

## Topic: { System.out.println(“class C”);

## Topic: System.out.println(“m=”+m);

## Topic: System.out.println(“n=”+n); Class Abc

{ public static void main(String args[])

## Topic: Classc Obj=new Classc(); Obj.displayb(); Obj.displayc();

## Topic: Output: Class B M=10

## Topic: Class C M=10 N=20

- If we want to create a package with multiple public classes in it, follow the steps o Decide the name of the package o Create a subdirectory with this name under the directory where the main source files are stored. o Create classes that are to be placed in the package in separate source files, and declare the package statement package packagename; at the top of each source file o Switch to the subdirectory created earlier and compile each source file. When compiled, the package would contain .class files of all the source files.
<!-- page: 8 -->

7

## Topic: //body Of A

 Store this file as A.java file under the directory p1
 Compile A.java file package p1; public class B

## Topic: //body Of B

 Store this file as B.java file under the directory p1

## Topic:  Compile B.java File

 Now the package will contain both classes A and B
- To hide a few classes of a package from external access, declare those as non-public.
Example: package p1; public class X
{ //body of X class Y
{ //body of Y
The class Y, which is not declared public, is hidden from outside the package p1. This class can be seen and used only by the other classes in the same package.
Consider the following code:

## Topic: Import P1.*;

## Topic: X Objectx; //correct

Y objectY; //error. Y is not available

1. By default, the Java run-time system looks for packages in the current working directory. If our package is in the current directory or a subdirectory of the current directory, it will be found.
3. Third, you can use the –classpath option with java and javac to specify the path to your classes o For example, consider the following package specification: package MyPack o In order for a program to find MyPack, one of three things must be true. Either the program can be executed from a directory immediately above MyPack, or the CLASSPATH must be set to include the path to MyPack, or the classpath option must specify the path to MyPack when the program is run via Java.
<!-- page: 9 -->

8
C:\MyPrograms\Java\MyPack o Then the class path to MyPack is

## Topic: C:\myprograms\java

## Topic: Example: // A Simple Package Package Mypack; Class Balance

{ String name; double bal;
Balance(String n, double b)
{ name = n; bal = b; void show()
{ if(bal<0)

## Topic: System.out.print(" > ");

System.out.println(name + ": $" + bal); class AccountBalance
{ public static void main(String args[])
{ Balance current[] = new Balance[3]; current[0] = new Balance("K. J. Fielding", 123.23); current[1] = new Balance("Will Tell", 157.02); current[2] = new Balance("Tom Jackson", -12.33); for(int i=0; i<3; i++) current[i].show(); o Call this file AccountBalance.java and put it in a directory called MyPack o Next, compile the file. Make sure that the resulting .class file is also in the MyPack directory.
Then, try executing the AccountBalance class, using the following command line: java MyPack.AccountBalance

## Topic: Access Protection
<!-- page: 10 -->

9

## Topic: Interfaces

- Java does not directly support multiple inheritance. Java provides an alternative approach known as interfaces to support this concept.
- An interface contains methods and variables. These methods should be abstract, and variables should be static and final.
- All methods and variables are implicitly public.
- The class that implements the interface should define the code for these methods.
- Syntax : access_specifier interface Interfacename variable declarations; method declarations;
Variables are declared as: static final type variablename=value;
Methods are declared as: returntype methodname(parameterlist);
When no access specifier is included, the interface is only available to other members of the package in which it is declared.
When it is declared as public, the interface can be used by any other code. In this case, the interface must be the only public interface declared in the file, and the file must have the same name as the interface.

## Topic: Class Interface

The methods in a class can be abstract or non-abstract
{ static final int code=1001; static final String name=”Fan”; void display(); interface Item
{ int code=1001;
String name=”Fan”; void display();
<!-- page: 11 -->

It can use various access specifiers like public, private or protected.

No constructors allowed. Can have constructors (used by subclasses).
Example: interface Animal void makeSound(); class Dog implements Animal public void makeSound()

## Topic: System.out.println("bark");

Example: abstract class Animal abstract void makeSound(); void sleep()

## Topic: System.out.println("sleeping"); Class Dog Extends Animal Void Makesound()

## Topic: System.out.println("bark");

- Implementing Interfaces o Once an interface has been defined, one or more classes can implement that interface.
General form: Class classname implements interfacename

## Topic: Body Of Classname

More General form: Class classname extends superclass implements interface1,interface2, … . . . .

## Topic: Body Of Classname

When a class implements more than one interface, they are separated by a comma.
When we implement an interface method, it must be declared as public.
<!-- page: 13 -->

{ float sportWt=6.0F; void putWt(); class Results extends Test implements Sports
{ float total; public void putWt()

## Topic: { System.out.println("sports Wt="+sportwt); Void Display()

{ total=part1+part2+sportWt; putNumber(); putMarks(); putWt();

## Topic: System.out.println("total Score="+total); Class Hybrid

{ public static void main(String a[])
{ Results student1=new Results(); student1.getNumber(1234); student1.getMarks(27.5F,33.0F); student1.display();

## Topic: Output: Roll No: 1234

## Topic: Part1= 27.5

## Topic: Part2 = 33.0

## Topic: Sports Wt=6.0

## Topic: Total Score = 66.5 O Partial Implementations

 If a class that implements an interface does not implement all the methods of the interface, then the class becomes an abstract class and this class cannot be used to create object.
Example: interface Callback void callback(int param); abstract class Incomplete implements Callback int a, b; void show()
System.out.println(a + " " + b);
<!-- page: 14 -->

 Here, the class Incomplete does not implement callback( ) and must be declared as abstract. Any class that inherits Incomplete must implement callback( ) or be declared abstract itself.
- Accessing Implementations Through Interface References o You can declare variables as object references that use an interface rather than a class type. o Any instance of any class that implements the declared interface can be referred to by such a variable. o Example: interface Callback void callback(int param); class Client implements Callback public void callback(int p)
System.out.println("callback called with " + p); public void newmethod(int p)
System.out.println("newmethod called with " + p); class Test public static void main(String args[])
Callback c = new Client(); c.callback(42);
Output: callback called with 42 o Here, variable c is declared to be of the interface type Callback, yet it was assigned an instance of Client. o c can be used to access the callback( ) method. It cannot access any other members of the
Client class. Thus, c could not be used to access newmethod( )
- Extending Interface o One interface can inherit another by use of the keyword extends. o The new subinterface will inherit all the members of the super interface. This is achieved by using the keyword extends
General form: interface name2 extends name1

## Topic: Body Of Name2
<!-- page: 15 -->

14
Example: we can put all the constants in one interface and the methods in the other. interface ItemConstants
{ int code=1001; string name=”Fan”; interface Item extends ItemConstants
{ void display();
Example: We can combine several interfaces together into a single interface interface ItemConstants
{ int code=1001; string name=”Fan”; interface ItemMethods
{ void display(); interface Item extends ItemConstants, ItemMethods o It is the responsibility of any class that implements the derived interface to define all the methods.

## Topic: Exception Handling

- An exception is an abnormal condition that arises in a code sequence at run time.
- An exception is a run-time error.
- In Java, an exception is an event that disrupts the normal flow of the program
- It is an object that is thrown at runtime
- The Exception Handling in Java is one of the powerful mechanism to handle the runtime errors so that the normal flow of the application can be maintained.

## Topic: Types Of Errors

- Compile-time errors o These errors are detected and displayed by the Java compiler o Most of the compile-time errors are due to typing mismatch o Ex: Missing ;, Mismatch of brackets, Misspelling of keywords and identifiers etc.
- Run-time errors o Such programs may produce wrong results due to wrong logic or may terminate due to errors such as stack overflow. o Ex: dividing an integer by zero, accessing an element that is out of the bounds of an array, trying to save an element into an array of incompatible type etc. o When such errors are encountered, Java generates an error message and aborts the program.
<!-- page: 16 -->

- Java exception handling is managed via five keywords: o try: Program statements that we want to monitor for exceptions are contained within a try block. If an exception occurs within the try block, it is thrown. o throw: System-generated exceptions are automatically thrown by the Java run-time system.
To manually throw an exception, use the keyword throw. o throws: Any exception that is thrown out of a method must be specified by a throws clause. o catch: catch block can catch this exception and handle it in some rational manner. o finally: Any code that must be executed before a method returns is put in a finally block.
- General form of an exception-handling block: try
// block of code to monitor for errors catch (ExceptionType1 exOb)
// exception handler for ExceptionType1 catch (ExceptionType2 exOb)
// exception handler for ExceptionType2
// ... finally
// block of code to be executed before try block ends
Here, ExceptionType is the type of exception that has occurred.

Output: java.lang.ArithmeticException: / by zero at Exc0.main(Exc0.java:4)
When the Java run-time system detects the attempt to divide by zero, it constructs a new exception object and then throws this exception. The exception is caught by the default handler provided by the Java run-time system. The default handler displays a string describing the exception and terminates the program. The type of the exception thrown is a subclass of Exception called ArithmeticException. class Exc0
{ public static void main(String args[])
{ int d = 0; int a = 42 / d;
<!-- page: 17 -->

Output: java.lang.ArithmeticException: / by zero at Exc1.subroutine(Exc1.java:4) at Exc1.main(Exc1.java:8)
The bottom of the stack is main’s line 8, which is the call to subroutine( ), which caused the exception at line 4. The call stack is quite useful for debugging, because it pinpoints the precise sequence of steps that led to the error.
- Handling the exceptions by the programmer(Using try and catch blocks) o Benefits of handling exceptions by the programmer:
 It allows to fix the error
 It prevents the program from automatically terminating o Enclose the code that we want to monitor inside a try block. Immediately following the try block, include a catch clause that specifies the exception type that we wish to catch.

## Topic: Output: Division By Zero

Once an exception is thrown, program control transfers out of the try block into the catch block. Execution never returns to the try block from a catch. Once the catch statement has executed, program control continues with the next line in the program following the entire try/catch mechanism. o A try and its catch statement form a unit. try must be surrounded by curly braces. The scope of the catch clause is restricted to those statements specified by the immediately class Exc1
{ static void subroutine()
{ int d = 0; int a = 10 / d; public static void main(String args[])

## Topic: Exc1.subroutine(); Class Exc2

{ public static void main(String args[])
{ int d, a; try
{ d = 0; a = 42 / d;
System.out.println("This will not be printed."); catch (ArithmeticException e) // catch divide-by-zero error
{ System.out.println("Division by zero.");

## Topic: System.out.println("after Catch Statement.");
<!-- page: 18 -->

17
 In some cases, more than one exception could be raised by a single piece of code. To handle this type of situation, we can specify two or more catch clauses, each catching a different type of exception. When an exception is thrown, each catch statement is inspected in order, and the first one whose type matches that of the exception is executed. After one catch statement executes, the others are bypassed, and execution continues after the try/catch block.
 Example: this program traps two different exception types: class MultiCatch
{ public static void main(String args[])
{ try
{ int a = args.length;
System.out.println("a = " + a); int b = 42 / a; int c[] = { 1 }; c[42] = 99; catch(ArithmeticException e)
{ System.out.println("Divide by 0: " + e); catch(ArrayIndexOutOfBoundsException e)
{ System.out.println("Array index oob: " + e);

## Topic: System.out.println("after Try/catch Blocks.");

## Topic: Input1: Java Multicatch

Output1: a = 0
Divide by 0: java.lang.ArithmeticException: / by zero

## Topic: After Try/catch Blocks

## Topic: Input2: Java Multicatch Hai

Output2: a = 1
Array index oob: java.lang.ArrayIndexOutOfBoundsException

## Topic: After Try/catch Blocks

This program will cause a division-by-zero exception if it is started with no commandline parameters, since a will equal zero. It will survive the division if you provide a command-line argument, setting a to something larger than zero. But it will cause an ArrayIndexOutOfBoundsException, since the int array c has a length of 1, yet the program attempts to assign a value to c[42].
<!-- page: 19 -->

 A subclass must come before its superclass in a series of catch statements. A catch statement that uses a superclass will catch exceptions of that type plus any of its subclasses. Thus, a subclass would never be reached if it came after its superclass.
Further, in Java, unreachable code is an error.
 Example: This program contains an error. class SuperSubCatch
{ public static void main(String args[])
{ try
{ int a = 0; int b = 42 / a; catch(Exception e)
{ System.out.println("Generic Exception catch."); catch(ArithmeticException e) // This catch is never reached
{ System.out.println("This is never reached.");
Since ArithmeticException is a subclass of Exception, the first catch statement will handle all Exception-based errors, including ArithmeticException. This means that the second catch statement will never execute. To fix the problem, reverse the order of the catch statements. o Nested try Statements
 A try statement can be inside the block of another try.
 Each time a try statement is entered, the context of that exception is pushed on the stack.
If an inner try statement does not have a catch handler for a particular exception, the stack is unwound, and the next try statement’s catch handlers are inspected for a match.
This continues until one of the catch statements succeeds, or until all of the nested try statements are exhausted. If no catch statement matches, then the Java run-time system will handle the exception.

## Topic:  Example : Class Nesttry

{ public static void main(String args[])
{ try
{ int a = args.length; int b = 42 / a; // division by zero may occur
System.out.println("a = " + a); try // nested try block
{ if(a==1) a = a/(a-a); // division by zero if(a==2)
{ int c[] = { 1 }; c[42] = 99; // out-of-bounds exception
<!-- page: 20 -->

19
{ System.out.println("Array index out-of-bounds: " + e); catch(ArithmeticException e)
{ System.out.println("Divide by 0: " + e);

## Topic: Input1: C:\>java Nesttry

Output1: Divide by 0: java.lang.ArithmeticException: / by zero

## Topic: Input2: C:\>java Nesttry One

Output2: a = 1
Divide by 0: java.lang.ArithmeticException: / by zero

## Topic: Input3: C:\>java Nesttry One Two

` Output3: a = 2
Array index out-of-bounds: java.lang.ArrayIndexOutOfBoundsException
When we execute the program with no command-line arguments, a divide-by-zero exception is generated by the outer try block.
Execution of the program by one command-line argument generates a divide-by-zero exception from within the nested try block. Since the inner block does not catch this exception, it is passed on to the outer try block, where it is handled.
If you execute the program with two command-line arguments, an array boundary exception is generated from within the inner try block.
 Example: Try statements can be implicitly nested via calls to methods class MethNestTry
{ static void nesttry(int a)
{ try
{ if(a==1) a = a/(a-a); // division by zero if(a==2)
{ int c[] = { 1 }; c[42] = 99; // generate an out-of-bounds exception catch(ArrayIndexOutOfBoundsException e)
{ System.out.println("Array index out-of-bounds: " + e); public static void main(String args[])
{ try
{ int a = args.length; int b = 42 / a;
<!-- page: 21 -->

System.out.println("a = " + a); nesttry(a); catch(ArithmeticException e)
{ System.out.println("Divide by 0: " + e);
 throw statement is used to throw an exception explicitly.

## Topic:  Syntax : Throw Throwableinstance;

 The flow of execution stops immediately after the throw statement. Any subsequent statements are not executed. The nearest enclosing try block is inspected to see if it has a catch statement that matches the type of the exception. If it does find a match, control is transferred to that statement. If not, then the next enclosing try statement is inspected, and so on. If no matching catch is found, then the default exception handler halts the program and prints the stack trace.

## Topic:  Example: Class Throwdemo

{ public static void main(String args[])
{ try
{ throw new NullPointerException("demo"); catch(NullPointerException e)
System.out.println("Caught: " + e);

## Topic: Output: Caught: Java.lang.nullpointerexception: Demo

## Topic:  Example: Class Throwdemo

{ static void demoproc()
{ try
{ System.out.println("Caught inside demoproc."); throw e; // rethrow the exception
<!-- page: 22 -->

21
{ try
{ demoproc(); catch(NullPointerException e)
System.out.println("Recaught: " + e);

## Topic: Output: Caught Inside Demoproc

## Topic: Recaught: Java.lang.nullpointerexception: Demo

This program gets two chances to deal with the same error. First, main( ) sets up an exception context and then calls demoproc( ). The demoproc( ) method then sets up another exception-handling context and immediately throws a new instance of
NullPointerException, which is caught on the next line. The exception is then rethrown.
 All of Java’s built-in run-time exceptions have at least two constructors:
- One with no parameter and
- One that takes a string parameter: The argument specifies a string that describes the exception. This string is displayed when the object is used as an argument to println( ). o throws
 All exceptions that a method can throw, except those of type Error or
RuntimeException, or any of their subclasses must be declared in the throws clause.
 A throws clause lists the types of exceptions that a method might throw.
 Syntax: type method-name(parameter-list) throws exception-list
// body of method
Here, exception-list is a comma-separated list of the exceptions that a method can throw.
 Example : This program contains an error and will not compile. class ThrowsDemo
{ static void throwOne()
System.out.println("Inside throwOne."); throw new IllegalAccessException("demo"); public static void main(String args[])
{ throwOne();
<!-- page: 23 -->

To make this example compile, need to make two changes class ThrowsDemo
{ static void throwOne() throws IllegalAccessException
{ try
{ throwOne(); catch (IllegalAccessException e)
{ System.out.println("Caught " + e);
Output : inside throwOne caught java.lang.IllegalAccessException: demo o finally
 finally creates a block of code that will be executed after a try/catch block has completed.
 finally block is used to handle any exception generated within a try block which is not caught by any of the previous catch statements.
 The finally block will execute whether or not an exception is thrown.
 If an exception is thrown, the finally block will execute even if no catch statement matches the exception.
 Any time a method is about to return to the caller from inside a try/catch block, the finally clause is also executed just before the method returns.
 The finally clause is optional.
 Each try statement requires at least one catch or a finally clause.

## Topic:  Syntax: Try

……………… finally
……………..

## Topic:  Syntax: Try

……………… catch(){……………} catch(){……………} catch(){……………}
.
<!-- page: 24 -->

. finally
……………..
 Example : shows three methods that exit in various ways, none without executing their finally clauses class FinallyDemo static void procA()
{ try
System.out.println("inside procA"); throw new RuntimeException("demo"); finally
{ System.out.println("procA's finally"); static void procB()
{ try
{ System.out.println("inside procB"); return; finally
{ System.out.println("procB's finally"); static void procC()
{ try
{ System.out.println("inside procC"); finally
{ System.out.println("procC's finally"); public static void main(String args[])
{ try
{ procA(); catch (Exception e)
{ System.out.println("Exception caught"); procB(); procC();
<!-- page: 25 -->

Output: inside procA procA’s finally
Exception caught inside procB procB’s finally inside procC procC’s finally procA( ) prematurely breaks out of the try by throwing an exception. The finally clause is executed on the way out. procB( )’s try statement is exited via a return statement. The finally clause is executed before procB( ) returns. In procC( ), the try statement executes normally, without error. However, the finally block is still executed.
- Java’s Built-in Exceptions o All exception types are subclasses of the built-in class Throwable. o Immediately below Throwable, there are two subclasses:

## Topic:  Exception

- This class is used for exceptional conditions that user programs should catch.
- This is also used to create our own custom exception types.
- There is an important subclass of Exception, called RuntimeException. Exceptions of this type are automatically defined for the programs that you write and include things such as division by zero and invalid array indexing.

## Topic:  Error

- It represents serious problems that usually cannot or should not be handled by applications.
- It is typically caused by the JVM or system environment (not by user code).

## Topic: Examples: O Outofmemoryerror O Stackoverflowerror O Virtualmachineerror
<!-- page: 26 -->

25
 The Java run-time system: due to the violation of the rules of the Java language or constraints of the Java execution environment
 Manually generated by our code o java.lang package contains several exception classes. o Since java.lang is implicitly imported into all Java programs, most exceptions derived from
RuntimeException are automatically available. o The most general of these exceptions are subclasses of the standard type RuntimeException. o Two types of exceptions:

## Topic:  Unchecked Exceptions

- Definition: Exceptions that are not checked at compile-time.
- Unchecked exceptions happen at runtime when the executable program starts running.
- They are typically the result of programming errors such as logic flaws or improper use of APIs.
- All exceptions that inherit from RuntimeException or Error are unchecked exceptions.
- It is not required to handle unchecked exceptions explicitly. They need not be included in any method’s throws list.
- Common examples: o NullPointerException o ArrayIndexOutOfBoundsException o ArithmeticException o IllegalArgumentException
<!-- page: 27 -->

## Topic:  Checked Exceptions

- Definition: Exceptions that are checked at compile-time.
- All exceptions that inherit from the Exception class (except those that inherit from
RuntimeException) are checked exceptions.
- Compiler forces you to either: o Handle them using try-catch, OR o Declare them with throws in the method signature
- These usually represent recoverable conditions that happen due to external factors.
- Common examples: o IOException o SQLException o ClassNotFoundException o FileNotFoundException

## Topic: Java’s Unchecked Runtimeexception Subclasses

## Topic: Exception Meaning

ArithmeticException Arithmetic error, such as divide-by-zero.

IllegalMonitorStateException Illegal monitor operation, such as waiting on an unlocked thread.
IndexOutOfBoundsException Some type of index is out-of-bounds.

## Topic: Java’s Checked Runtimeexception Subclasses

## Topic: Exception Meaning
<!-- page: 28 -->

- Creating User-Defined/Custom Exceptions o User-defined exceptions are used to handle situations specific to our applications. o In order to create a user-defined exception, we need to extend the Exception class that belongs to java.lang package. o Then define constructors for the exception class and override the method toString(). o Example: Write a java program that catches NegativeException. This occurs when the user enters a negative number. import java.util.*; class NegativeException extends Exception
{ int a;

## Topic: Negativeexception(int X)

{ a=x; public String toString() return(a+" is a -ve number"); public class A
{ public static void main(String[] args)
{ try

## Topic: { Scanner Sc=new Scanner(system.in);

System.out.print("Enter a number:"); int a=sc.nextInt(); if(a<0) throw new NegativeException(a); catch(NegativeException e)

## Topic: { System.out.println(e);

## Topic: Output : Enter A Number: 12

-12 is a -ve number toString( ) returns a String object containing a description of the exception. This method is called by println( ) when outputting a Throwable object.
- Introduction to design patterns in Java o Design Patterns are proven solutions to common software design problems. o They represent best practices used by experienced object-oriented developers. o In Java, design patterns help:
<!-- page: 29 -->

 Improve code reusability.
 Make code maintainable and scalable.
 Improve communication among developers using a shared vocabulary. o Design patterns are categorized into:
1. Creational – how objects are created (e.g., Singleton).
2. Structural – how classes and objects are composed (e.g., Adapter).
3. Behavioral – how objects interact and communicate. o Singleton Pattern (Creational)
 Ensure that a class has only one instance and provide a global point of access to it.

## Topic:  Use Case

- When you need only one object of a class throughout the application, such as: o Configuration manager
<!-- page: 30 -->

29

## Topic:  Example Public Class Singleton

// Step 1: Create a private static instance private static Singleton instance;
// Step 2: Make the constructor private private Singleton() {}
// Step 3: Provide a public static method to get the instance public static Singleton getInstance() if (instance == null) instance = new Singleton(); // lazy initialization return instance; o Adapter Pattern (Structural)
 Convert the interface of a class into another interface that clients expect.

## Topic:  Use Case

- When you want to integrate a class into your code, but its interface doesn't match the existing system.
- For example: o Integrating legacy code or third-party libraries. o Providing a wrapper to make incompatible interfaces work together

## Topic:  Real World Analogy

- A power plug adapter that allows a US plug to fit in a European socket.
Assume you have a legacy class:
// Incompatible class class OldPrinter public void printText(String s)
System.out.println("Printing from OldPrinter: " + s);
<!-- page: 31 -->

You want to use it through a standard interface:
// Target interface interface Printer void print(String text);
// Adapter class class PrinterAdapter implements Printer private OldPrinter oldPrinter; public PrinterAdapter(OldPrinter oldPrinter) this.oldPrinter = oldPrinter;
@Override public void print(String text) oldPrinter.printText(text); // adapting method
Usage public class Main public static void main(String[] args)

## Topic: Oldprinter Oldprinter = New Oldprinter();

## Topic: Printer Printer = New Printeradapter(oldprinter); Printer.print("hello Adapter Pattern!");
<!-- page: 32 -->
