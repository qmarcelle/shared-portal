## Process Overview

The process involves connecting to the Genesys configuration service every hour to retrieve configuration data. This data is then stored in a static object, which includes results from various databases.

## Databases

- **Chat_Global_DB**: A map of strings.
- **Chat_Bot_DB**: A list of strings.
- **Routing_Chat_Bot_DB**: A list of strings.
- **Working_Hours_DB**: A map of strings.

## Chat Eligibility

To determine chat eligibility:
- A user is considered eligible if they are present in the Chat_Global_DB.
- There is an override for user 127600 if they have a plan after a specific date.

## Member Object

The relevant data is added to a Member Object, which is then read by Member Theme (Member Utils) to provide helper and formatting methods.

## Chat Widget Configuration

Finally, Click_To_Chat.jspf retrieves information from Member Theme to configure the Chat Widget.

```mermaid
graph TD
    A[Connect to Genesys config service every hour] --> B[Pull configuration data and store DB results in static object: Chat_Global_DB, Chat_Bot_DB, Routing_Chat_Bot_DB, Working_Hours_DB]
    B --> E[Determine Chat Eligibility]
    E --> F{Is user in Chat_Global_DB?}
    F -->|Yes| G[Check Group]
    F -->|No| H[Not Eligible]
    G --> I{Is user in Group 127600?}
    I -->|No| J[Eligible]
    I -->|Yes| K{Has plan after 01/01/1700?}
    K -->|Yes| J[Eligible]
    K -->|No| H[Not Eligible]
    H --> L[Add data to Member Object]
    J --> L[Add data to Member Object]
    L --> M[Member Theme reads Member Object details]
    M --> N[Provides helper/formatting methods]
    N --> O[Click_To_Chat.jspf retrieves information]
    O --> P[Configures the Chat Widget]
```
