# Psuedo Content Management System

This site was created to enable me to display and quickly update a portfolio of creative projects. 

## XML Data 
Because of the nature of github pages, I neeeded to create a solution that did not involve use of a database. Data is stored in an XML file that is accessed using jQuery.

## Page Initialization with Templates
The XML data is first loaded. The data is used to generate preview images/link buttons from a html template.  

## Reduce Unnecessary Server Load/Requests 
Additional images are loaded only after the user clicks on a preview. This helps reduce unncessary server requests.
