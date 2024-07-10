# Chattus
## Description
Chattus frontend is a web application designed for creating and joining chat rooms with various configurable settings. It leverages modern web technologies to provide a seamless and interactive user experience. The application allows users to set room configurations, join existing rooms, and communicate in real-time.

![Chatus img](/chattus.png)

## Page Explanation
- **Create Room:** Users can create a new room with customizable settings such as the maximum number of users, inactivity timeout, and message limits. Tooltips provide additional information on each setting.
- **Join Room:** Users can join an existing room by entering a room code. The interface includes animations and a QR code scanner for ease of access.
- **Room Settings:** In the room creation page, users can configure various aspects of the room to suit their needs, including mandatory focus and message limits.
- **Real-Time Communication:** Utilizes WebSockets for real-time messaging and updates within rooms.

![Chatus gif](/chattus.gif)

## Technologies Used
- **React:** A JavaScript library for building user interfaces, facilitating the creation of reusable UI components.
- **Styled-Components:** Utilized for styling, allowing for CSS in JS usage, which enhances component modularity and theming.
- **Redux Toolkit:** For state management, simplifying the store setup and reducing boilerplate.
- **React Router DOM:** Manages routing, enabling navigation between different - **components** without reloading the page.
- **WebSockets:** For real-time bi-directional communication between clients and the server.
- **Vite:** As a build tool, offering a faster and more efficient development experience compared to traditional tools.
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
