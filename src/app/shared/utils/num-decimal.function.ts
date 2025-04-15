export const numDecimal = {validateNumberInput(event: KeyboardEvent): void {
        const char = event.key;
        if (!/^\d$/.test(char)) { // Allow only digits
          event.preventDefault();
        }
      },
      
      enforceMaxValue(event: any): void {
        const input = event.target;
        let value = input.value;
      
        // Remove decimals if entered
        if (value.includes('.')) {
          value = value.split('.')[0];
        }
      
        // Convert to number and enforce limits
        const numericValue = Number(value);
        if (numericValue > 100) {
          input.value = '100';
        } else if (numericValue < 0) {
          input.value = '0';
        } else {
          input.value = numericValue.toString();
        }
      }
}