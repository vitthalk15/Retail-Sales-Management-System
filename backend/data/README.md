# Data Directory

Place your CSV dataset file in this directory.

The system will automatically import CSV files from this directory on first startup.

**Note**: Large CSV files should not be committed to Git. They are excluded via `.gitignore`.

## Instructions

1. Place your CSV file (e.g., `truestate_assignment_dataset.csv`) in this directory
2. Start the backend server
3. The system will automatically detect and import the CSV file
4. Import progress will be shown in the console

## File Format

The CSV file should contain the following columns (or compatible):
- Customer ID, Customer Name, Phone Number, Gender, Age, Customer Region, Customer Type
- Product ID, Product Name, Brand, Product Category, Tags
- Quantity, Price per Unit, Discount Percentage, Total Amount, Final Amount
- Date, Payment Method, Order Status, Delivery Type
- Store ID, Store Location, Salesperson ID, Employee Name

