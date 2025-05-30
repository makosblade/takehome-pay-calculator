# Takehome Pay Calculator

## Description
A web application to help users calculate their take-home pay after taxes and deductions. This tool assists in understanding potential tax liabilities and provides insights for better financial planning.

## Features
*   Calculates estimated U.S. federal income taxes.
*   Supports various income scenarios, including:
    *   Regular salary
    *   Dual earner households
    *   Special income (e.g., bonuses, freelance income)
    *   Stock options (ISO, NSO)
*   Supports various filing statuses (e.g., Single, Married Filing Jointly). Refer to the application for a complete list of supported statuses.
*   Provides W-4 form guidance based on calculations.
*   Offers a "Safe Harbor" calculation to help avoid underpayment penalties.
*   Includes tools for specific calculations like AMT (Alternative Minimum Tax) for stock options.

## Getting Started

### Prerequisites
*   Node.js (v18 or later recommended)
*   pnpm (or npm/yarn)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
    (Replace <repository-url> with the actual URL of this repository)
2.  Navigate to the project directory:
    ```bash
    cd takehome-pay-calculator
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
    (or `npm install` / `yarn install`)

## Usage
*   **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start the application, typically at `http://localhost:5173`.

*   **Build for production:**
    ```bash
    pnpm build
    ```
    This command compiles the TypeScript code and bundles the application for deployment.

*   **Lint the code:**
    ```bash
    pnpm lint
    ```
    This checks the codebase for potential errors and style inconsistencies.

*   **Preview the production build:**
    ```bash
    pnpm preview
    ```
    This command serves the production build locally for testing before deployment.

## Technologies Used
*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **ESLint:** A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

## Contributing
Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

## License
This project is currently unlicensed.
