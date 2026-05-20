---
subject: "Object Oriented Programming"
subject_code: "CODE_UNKNOWN"
branch: "Unknown"
semester: 3
module: null
source_type: "notes"
status: "draft"
original_file: "Strings-KTUNOTES.LIVE.pdf"
original_path: "S3/OBJECT ORIENTED PROGRAMMING/Strings-KTUNOTES.LIVE.pdf"
content_hash: "0a37e6f9dfb8e9c3d5b09b04ecb7e9dbdfed2816b6a91c46a1c79ee79093eee7"
extraction_quality: "good"
needs_review: true
contains_figures: false
contains_equations: true
contains_diagrams: false
diagram_needs_review: false
equation_needs_review: false
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
Example: public class St { public static void main(String[] args) {

## Topic: // 1. Creating Strings
// Using a string literal (most common and efficient)

## Topic: String Message1 = "hello, World!";
// Using the 'new' keyword and the String constructor

## Topic: String Message2 = New String("java Programming");
// Creating a String from a character array char[] charArray = {'J', 'a', 'v', 'a', ' ', 'S', 't', 'r', 'i', 'n', 'g'};

## Topic: String Message3 = New String(chararray);
System.out.println("Message 1: " + message1);
System.out.println("Message 2: " + message2);
System.out.println("Message 3: " + message3);

## Topic: // 2. Common String Methods
// Getting the length of a string int length = message1.length();
System.out.println("Length of message1: " + length); // Output: 13

## Topic: // Concatenating Strings
String combinedMessage = message1 + " " + message2; // Using '+' operator
System.out.println("Combined message: " + combinedMessage);
String anotherCombined = message1.concat(" from " + message2);
// Using concat() method
System.out.println("Another combined message: " + anotherCombined);
// Checking for equality (case-sensitive and case-insensitive)
String strA = "apple";
String strB = "Apple";
System.out.println("strA equals strB (case-sensitive): " + strA.equals(strB)); // Output: false
System.out.println("strA equals strB (case-insensitive): " + strA.equalsIgnoreCase(strB));

## Topic: // Output: True
// Extracting a substring
String sub = message2.substring(5, 16); // Extracts "Programming"
System.out.println("Substring of message2: " + sub);
// Finding the index of a character or substring int index = message1.indexOf('W');

<!-- page: 3 -->
System.out.println("Index of 'W' in message1: " + index);
// Output: 7 int javaIndex = message2.indexOf("Java");
System.out.println("Index of 'Java' in message2: " + javaIndex);

## Topic: // Output: 0

## Topic: // Replacing Characters
String replacedString = message1.replace('o', 'X');
System.out.println("String with 'o' replaced by 'X': " + replacedString);

## Topic: // Converting Case
String upperCase = strA.toUpperCase();
String lowerCase = strB.toLowerCase();
System.out.println("Uppercase strA: " + upperCase);
System.out.println("Lowercase strB: " + lowerCase);
}
}

## Topic: Output

## Topic: Message 1: Hello, World!

## Topic: Message 2: Java Programming

## Topic: Message 3: Java String
Length of message1: 13

## Topic: Combined Message: Hello, World! Java Programming
Another combined message: Hello, World! from Java Programming strA equals strB (case-sensitive): false strA equals strB (case-insensitive): true

## Topic: Substring Of Message2: Programming
Index of 'W' in message1: 7
Index of 'Java' in message2: 0
String with 'o' replaced by 'X': HellX, WXrld!

## Topic: Uppercase Stra: Apple

## Topic: Lowercase Strb: Apple

<!-- page: 4 -->
w e b s i t e f o r m o r e m a t e r i a l s
O U R T E L E G R A M C H A N N E L f o r n o t e s a n d d i s c u s s i o n a n d u p d a t e s
S C A N T H E Q R C O D E S
K T U N O T E S . L I V E

## Topic: 0 2 4 S C H E M E
F o r W h a t s A p p g r o u p j o i n o u r W h a t s A p p g r o u p g e t i n t o o u r w e b s i t e
C L I C K T H E L O G O T O J O I N
O U R W H A T S A P P G R O U P f o r n o t e u p d a t e s a n d n o t i f i c a t i o n s
O U R W E B S I T E g e t i n a n d d o w n l o a d a l l 2 0 2 4 m a t e r i a l s
