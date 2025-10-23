# Saving-to-Krypto
Save money to buy cryptocurrency frenquently

---

## Component & Context Architecture

This diagram illustrates the application's architecture after the context refactoring. It features a 3-tier context structure for clear separation of concerns.

```
<AppProvider>   [<-- GLOBAL APP MANAGER: Handles shared UI (e.g., Modals)]
│   • state: confirmationModal
│   • functions: handleOpenConfirmationModal, etc.
│
└── <App>
    │
    ├── <SavvyProvider>   [<-- SAVVY WING (Independent)]
    │   │   • Manages: goals, savings, etc.
    │   │   • Uses `useContext(AppContext)` to request shared services.
    │   │
    │   └── <Savvy>
    │       └── ... (Savvy specific components)
    │
    ├── <PortfolioProvider>   [<-- PORTFOLIO WING (Independent)]
    │   │   • Manages: transactions, holdings, etc.
    │   │   • Uses `useContext(AppContext)` to request shared services.
    │   │
    │   └── ... (Portfolio specific components)
    │
    ├── <CelebrationModal />
    │
    └── <ConfirmationModal />
```