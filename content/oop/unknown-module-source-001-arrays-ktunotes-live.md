---
subject: "Object Oriented Programming"
subject_code: "CODE_UNKNOWN"
branch: "Unknown"
semester: 3
module: null
source_type: "notes"
status: "draft"
original_file: "arrays-KTUNOTES.LIVE.pdf"
original_path: "S3/OBJECT ORIENTED PROGRAMMING/arrays-KTUNOTES.LIVE.pdf"
content_hash: "2c1b7cd6e79ea208862d7f227f2ffc3ef74357483d76c36407ca7cd3f1b0cf7b"
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
Types of Arrays in Java a. Single-Dimensional Arrays b. Multi-Dimensional Arrays a) Single-Dimensional Arrays:
A Single-Dimensional Array is a linear array where elements are stored and accessed in a one-dimensional (1D) index-based structure.
Example: public class array { public static void main(String[] args) { int[] arr = {5, 10, 15}; for (int i = 0; i < arr.length; i++) {
System.out.println("Element at index " + i + ": " + arr[i]);
}
}
}
Output: Element at index 0: 5
Element at index 1:10

## Topic: Element At Index 2:15 B) Multi Dimensional Arrays
A Multi-Dimensional Array is an array of arrays.
The most commonly used is the two-dimensional (2D) array, which can be visualized as a matrix or table of rows and columns.

## Topic: Syntax: Type Var Name[][];

## Topic: Eg: Int A[][];

## Topic: Initialisation Of 2 Dimensional Array
Syntax: type var_name[] [] = new type[][];
Eg: int b[][] = new int[4][5]; here 4 rows and 5 columns
// Demonstrate a two-dimensional array. class Multi { public static void main(String args[]) { int twoD[][]= new int[4][5]; // Declare a 2D array of size 4x5

<!-- page: 3 -->
int i, j, k = 0; for(i=0; i<4; i++) // Fill the array with incremental values for(j=0; j<5; j++) { twoD[i][j] = k; k++;
} for(i=0; i<4; i++) { // Print the 2D array for(j=0; j<5; j++)
System.out.print(twoD[i][j] + " ");

## Topic: System.out.println();
}
}
}
O/P:
0 1 2 3 4
5 6 7 8 9
10 11 12 13 14
15 16 17 18 19

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
