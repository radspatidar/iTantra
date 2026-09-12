You are an expert mobile application engineer, UI/UX designer, and product prototyping engineer.

Build a WORKING mobile application prototype for the following Smart India Hackathon problem:

Problem Statement ID: SIH26173
Problem Statement:
"iTantra - Indian Multilingual TTS & STT Aided Neural Transceiver Radio Access for low bitrate links"

Application name:
iTantra

Tagline:
"Voice without barriers"

IMPORTANT:
Use the attached/project report and PPT as the primary design and functionality reference.

Do NOT add additional functionality.
Do NOT turn this into a large communication/social application.
Keep the implementation minimal, focused, user-friendly, responsive, and visually polished.

The goal is a working prototype that demonstrates the core SIH concept clearly.

==================================================
1. CORE PRODUCT CONCEPT
==================================================

The application converts spoken communication into a compact text representation, transmits the text between nearby devices, and converts the received text back into speech.

Core flow:

User speaks
↓
Voice activity / speech detection
↓
Speech-to-Text
↓
Text message
↓
Priority classification
↓
Compact text transmission
↓
Receiving device
↓
Text-to-Speech
↓
Voice playback

The application must demonstrate that voice can be communicated without transmitting raw audio.

The system is intended for:
- disaster communication
- remote field communication
- low-bandwidth environments
- situations where internet/cloud services are unavailable
- multilingual communication

The application must be designed around OFFLINE-FIRST communication.

Do not add:
- social media features
- user profiles
- chat groups
- cloud accounts
- login/signup
- payments
- advertisements
- unnecessary dashboards
- unnecessary analytics
- video calling
- file sharing
- camera features
- location tracking
- maps
- contacts management
- unnecessary settings
- unnecessary onboarding flows

==================================================
2. TECHNOLOGY / IMPLEMENTATION APPROACH
==================================================

Create a real mobile project with clean, maintainable architecture.

Prefer:
- Flutter + Dart

Use a responsive mobile-first UI.

The project must be runnable locally.

If full native STT/TTS models or Bluetooth/Wi-Fi Direct integration cannot reasonably be executed in the prototype environment, create clean service interfaces and a realistic local/mock implementation so the complete user flow actually works.

IMPORTANT:
Do NOT fake the architecture visually while leaving buttons non-functional.

Every visible interaction required by the prototype should work.

Structure the code so that real offline engines can later replace the mock implementations.

Suggested service abstractions:

SpeechRecognitionService
TextToSpeechService
ConnectionService
MessageService
PriorityService

For the prototype:
- Speech input may use a local/mock speech recognition implementation if the actual offline model is unavailable.
- TTS may use the device's local speech engine if available.
- Communication may use a simulated local peer connection if actual P2P transport is unavailable.
- Clearly keep these implementations replaceable.

Do NOT use cloud APIs for STT/TTS.

Do NOT send recorded audio to external servers.

==================================================
3. REQUIRED MODES
==================================================

The application must support TWO UI themes:

1. Light Mode
2. Dark Mode

Both themes must be completely designed.

The UI should look intentional in both themes, not simply be an inverted color scheme.

Provide a simple theme toggle in Settings.

Persist the selected theme locally.

==================================================
4. VISUAL DESIGN DIRECTION
==================================================

The design should be inspired by the supplied PPT wireframe but should be improved into a polished real mobile application.

Design style:

- modern
- professional
- emergency/field communication focused
- clean
- minimal
- highly readable
- large touch targets
- strong visual hierarchy
- accessible under stress
- responsive
- Android-friendly

Avoid:
- excessive gradients
- excessive animations
- excessive cards
- decorative UI with no purpose
- complicated navigation
- unnecessary information

Use a clean typography system.

Suggested visual language:

Primary:
Deep teal / blue-green

Secondary:
Blue

Success:
Green

Important:
Amber

Emergency:
Red

Dark mode:
Deep navy/charcoal background with high-contrast text and teal accents.

Light mode:
White/off-white background with dark text and teal/blue accents.

Emergency UI should clearly use red without making the entire application visually aggressive.

==================================================
5. APPLICATION STRUCTURE
==================================================

Keep navigation extremely simple.

Required screens:

1. Talk
2. Connection
3. Settings
4. Incoming Alert

Do NOT create separate Contacts, Profile, Login, Signup, Dashboard, History, or other screens.

==================================================
6. TALK SCREEN
==================================================

This is the primary/home screen.

Header:

iTantra · Talk

Subtitle:
Voice without barriers

Show a small connection indicator.

Example:

● Connected
Field Unit 2
BLE · Strong Signal

If disconnected:

● Not Connected
No nearby device

The connection card should be tappable and open the Connection screen.

--------------------------------------------------
LANGUAGE
--------------------------------------------------

Show:

Select Language

Display a few quick-select language chips:

Hindi
मराठी
English

Include:

See All

When "See All" is pressed, show the complete supported language list:

1. Hindi
2. Gujarati
3. Marathi
4. Kannada
5. Malayalam
6. Tamil
7. Telugu
8. Odia
9. Bengali
10. English

The selected language must be visually obvious.

Do not add translation features.

The selected language represents the language used for speech recognition/TTS.

--------------------------------------------------
LIVE TRANSCRIPT
--------------------------------------------------

Show a compact transcript card.

Example:

Live Transcript

"सभी यूनिट अपनी स्थिति की रिपोर्ट करें"

When the user presses the talk button, update the transcript state.

For the prototype, use realistic sample text if actual offline STT is unavailable.

--------------------------------------------------
MAIN PUSH-TO-TALK BUTTON
--------------------------------------------------

This is the most important interaction.

Create a large circular microphone button.

Text:

Hold to Talk

Secondary text:

Tap and hold to speak

Interaction:

When pressed:
- visually indicate recording
- show active microphone state
- show "Listening..."
- animate the microphone/waveform subtly
- generate/update transcript
- release the button to finish speaking
- classify the message
- transmit it
- show sending state
- return to ready state

Do not use complicated animation.

The button must have a large touch target.

--------------------------------------------------
MODE CONTROLS
--------------------------------------------------

Show two controls:

PTT
Push to Talk

Duplex Mode
Both way voice

Default:

PTT = ON
Duplex Mode = OFF

When PTT is ON:
The application behaves like a walkie-talkie.

When Duplex Mode is ON:
The application behaves like continuous two-way voice communication.

Only one mode should be active at a time.

Do not add additional communication modes.

==================================================
7. CONNECTION SCREEN
==================================================

The Connection screen should be extremely simple.

Title:

Connection

Show available transport options:

Bluetooth
Wi-Fi Direct

Show the current connection.

Example:

Connected Device

Field Unit 2

Bluetooth
Strong Signal

Status:
Connected

Provide:

Connect

Disconnect

buttons as appropriate.

For prototype/demo purposes, allow selecting a simulated nearby device.

Example devices:

Field Unit 1
Field Unit 2
Field Unit 3

Do not create a device-management system.

Do not add contacts.

Do not add pairing history.

The purpose is only to demonstrate that two devices can communicate.

Show transport:

BLE

or

Wi-Fi Direct

The report specifies BLE/Wi-Fi Direct as the primary prototype transport options. Keep the UI restricted to these.

==================================================
8. MESSAGE TRANSMISSION
==================================================

When a user finishes speaking:

1. Detect speech completion.
2. Convert speech to text.
3. Determine priority.
4. Create a compact message object.
5. Send the text representation to the peer.
6. Receiving side processes the message.
7. TTS converts the text to speech.
8. Play the generated speech.

Represent the internal message concept approximately as:

{
  packet_id,
  timestamp,
  language,
  priority,
  text
}

Do not transmit raw audio in the prototype architecture.

Show a subtle transmission status:

Listening
→ Processing
→ Sending
→ Delivered

Keep this simple.

==================================================
9. PRIORITY CLASSIFICATION
==================================================

Implement exactly THREE priority levels:

1. Normal
2. Important
3. Emergency

Do not add more levels.

--------------------------------------------------
NORMAL
--------------------------------------------------

Normal messages:

- standard playback
- normal queue
- normal visual treatment

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Important messages:

- higher playback priority
- play after current message
- amber visual indicator

--------------------------------------------------
EMERGENCY
--------------------------------------------------

Emergency messages:

- red visual treatment
- immediate playback
- high-priority notification
- vibration
- maximum permitted playback volume where platform permissions allow
- should not be interrupted by normal messages

Example emergency phrases:

"Help"
"Fire"
"Evacuate"
"मुझे तुरंत सहायता चाहिए"

Use a simple keyword/intent-based classifier for the prototype.

Do not build a complex NLP system.

==================================================
10. INCOMING ALERT SCREEN
==================================================

Create the second major demonstration screen based on the supplied PPT wireframe.

When an emergency message is received, display:

Header:

Incoming · ALERT

Subtitle:

Priority Communication

Use a strong red emergency header.

Main card:

PRIORITY ALERT

"Announcing at maximum volume · cannot be interrupted"

Show:

Received Text

Example:

"सभी यूनिट तुरंत सुरक्षित स्थान पर पहुँचें"

Then:

Speaking Now · Hindi voice

Show a simple voice waveform.

Primary action:

ACKNOWLEDGE · REPLAY

The replay button should replay the message.

The acknowledge button should dismiss/acknowledge the alert.

The screen should clearly communicate that this is an emergency message.

Do NOT add emergency calling, SOS services, GPS, ambulance calling, or any external emergency integration.

==================================================
11. SETTINGS SCREEN
==================================================

Keep Settings minimal.

Only include required settings:

Appearance

Light
Dark

Connection preference:

Bluetooth
Wi-Fi Direct

Default language:

Select language

Audio:

Voice playback enabled

Do not add a large settings menu.

Do not add account settings.

Do not add privacy dashboards.

Do not add notifications management beyond what is required for emergency alerts.

==================================================
12. TWO-PHONE DEMONSTRATION
==================================================

The prototype must support a DEMO FLOW representing two phones.

Phone A:
Sender

Phone B:
Receiver

Demonstration:

Phone A:
- Select Hindi
- Connected to Field Unit 2
- Hold microphone
- Speak/sample message
- Transcript appears
- Message becomes text packet
- Message is sent

Phone B:
- Receives message
- Shows received text
- Priority is classified
- TTS playback starts

Emergency example:

Phone A:
"मुझे तुरंत सहायता चाहिए"

Phone B:
Incoming ALERT
PRIORITY ALERT
Speaking Now
ACKNOWLEDGE · REPLAY

The demo should make the semantic communication concept obvious to a judge.

==================================================
13. OFFLINE REQUIREMENT
==================================================

The architecture and UI must communicate:

OFFLINE

No cloud API.

No internet dependency.

No external backend.

No login.

No account.

No remote database.

No cloud speech recognition.

No cloud TTS.

If mock services are used for the prototype, clearly isolate them behind local service interfaces.

The application should remain usable without internet connectivity.

==================================================
14. REQUIRED SUPPORTED LANGUAGES
==================================================

Support the following language choices in the UI:

Hindi
Gujarati
Marathi
Kannada
Malayalam
Tamil
Telugu
Odia
Bengali
English

Do not add other languages.

==================================================
15. RESPONSIVE DESIGN
==================================================

The UI must work properly on:

- small Android phones
- normal Android phones
- larger Android phones

Avoid fixed dimensions that break layouts.

Use:

- responsive constraints
- SafeArea
- scalable typography
- adaptive spacing
- large accessible touch areas

The primary Talk screen must remain usable with one hand.

The PTT button must be easy to reach.

==================================================
16. ACCESSIBILITY / FIELD USABILITY
==================================================

Design for people operating the phone under stress.

Therefore:

- large microphone button
- large text
- strong contrast
- simple labels
- clear states
- minimal navigation
- obvious connected/disconnected state
- obvious emergency state
- no tiny controls
- no complicated gestures

Do not require typing to send a voice message.

==================================================
17. ANIMATION
==================================================

Use only meaningful animations:

- microphone recording pulse
- connection status transition
- sending progress
- emergency alert entrance
- audio waveform

Animations should be subtle and fast.

No decorative animations.

==================================================
18. DEMO DATA
==================================================

Use realistic sample data.

Connected device:

Field Unit 2

Transport:

BLE

Signal:

Strong Signal

Sample Hindi message:

"सभी यूनिट अपनी स्थिति की रिपोर्ट करें"

Sample emergency message:

"सभी यूनिट तुरंत सुरक्षित स्थान पर पहुँचें"

Sample English message:

"All units report your current status"

Use sample messages only for demonstrating the prototype.

==================================================
19. UI STATES THAT MUST WORK
==================================================

Talk screen states:

A. Disconnected
B. Connected
C. Ready
D. Listening
E. Processing
F. Sending
G. Delivered
H. Emergency received

Connection screen states:

A. No device
B. Devices available
C. Connecting
D. Connected
E. Disconnected

PTT states:

A. Idle
B. Pressed/listening
C. Released/processing
D. Sending
E. Complete

Emergency screen:

A. Incoming
B. Speaking
C. Acknowledged
D. Replay

Make sure these states are actually connected to the UI logic.

==================================================
20. DESIGN REFERENCE
==================================================

Use the supplied PPT's Android wireframe as the visual reference.

The existing wireframe has:

LEFT PHONE:
- iTantra · Talk
- Voice without barriers
- Connected To
- Field Unit 2
- BLE · Strong Signal
- Select Language
- Hindi / Marathi / English
- Live Transcript
- large microphone
- Hold to Talk
- PTT
- Duplex Mode

RIGHT PHONE:
- Incoming · ALERT
- Priority Communication
- PRIORITY ALERT
- Received Text
- Speaking Now
- waveform
- ACKNOWLEDGE · REPLAY

Preserve this conceptual hierarchy but create a more polished production-quality UI.

Do not blindly copy the wireframe.
Improve spacing, typography, component consistency, responsiveness, and theme support.

==================================================
21. LIGHT THEME
==================================================

Light theme should have:

- off-white/white background
- dark navy text
- teal primary controls
- blue secondary elements
- green connected state
- amber important state
- red emergency state

Cards should be subtle and clean.

Avoid excessive shadows.

==================================================
22. DARK THEME
==================================================

Dark theme should have:

- deep navy/charcoal background
- slightly lighter cards
- white/light-gray text
- teal primary action
- blue secondary elements
- green connected state
- amber important state
- red emergency state

Emergency red should remain highly visible.

Do not simply invert the light theme.

==================================================
23. NAVIGATION
==================================================

Use minimal navigation.

Primary navigation:

Talk
Settings

Connection can be opened from the connection card.

Incoming Alert is opened when an emergency message is received.

Do not create a bottom navigation with unnecessary tabs such as:
- Contacts
- History
- Profile
- Messages

unless absolutely required for the core interaction.

==================================================
24. CODE QUALITY
==================================================

Use a clean folder structure.

Suggested:

lib/
  core/
    theme/
    constants/
  models/
  services/
    speech/
    transport/
    priority/
  screens/
    talk/
    connection/
    settings/
    alert/
  widgets/

Use reusable components for:

- buttons
- status indicators
- language chips
- message cards
- waveform
- connection cards
- priority indicators

Avoid putting the entire application inside one file.

==================================================
25. FUNCTIONAL DEMO REQUIREMENT
==================================================

After implementation, test the complete flow:

1. Launch app.
2. Talk screen opens.
3. Default language is Hindi.
4. Connection shows Field Unit 2.
5. PTT is ON.
6. Press and hold microphone.
7. Listening state appears.
8. Release microphone.
9. Transcript appears.
10. Message is processed.
11. Message is sent.
12. Receiver receives text.
13. TTS playback occurs.
14. Emergency phrase triggers Emergency priority.
15. Incoming Alert screen opens.
16. Emergency audio plays.
17. ACKNOWLEDGE works.
18. REPLAY works.
19. Switch to dark theme.
20. Verify all screens remain visually correct.
21. Switch back to light theme.
22. Verify functionality remains intact.

==================================================
26. IMPORTANT: NO FEATURE CREEP
==================================================

Do NOT add functionality just because it is common in messaging applications.

Specifically DO NOT add:

- login
- signup
- user profile
- contacts
- groups
- chat history
- cloud storage
- backend server
- push notifications
- internet calling
- video calling
- file attachments
- image sharing
- location
- maps
- GPS
- SOS calling
- payments
- advertisements
- social features
- unnecessary analytics
- unnecessary onboarding
- unnecessary animations
- unnecessary AI features

Only implement functionality directly required to demonstrate the SIH26173 concept.

==================================================
27. PROTOTYPE PRIORITY
==================================================

Prioritize the following in this exact order:

1. Talk screen
2. Push-to-talk interaction
3. Language selection
4. Connection state
5. STT → text flow
6. Text transmission simulation
7. TTS playback
8. Emergency classification
9. Incoming alert
10. Light/Dark mode
11. Connection screen
12. Minimal Settings

If something must be simplified because of implementation limitations, simplify secondary functionality first.

Never compromise the primary Talk → Send → Receive → Speak flow.

==================================================
28. FINAL DELIVERABLE
==================================================

Create the complete runnable mobile application project.

It must include:

- complete source code
- dependency configuration
- reusable components
- light theme
- dark theme
- working navigation
- working state transitions
- working PTT interaction
- working language selection
- working connection simulation
- working message transmission simulation
- working priority classification
- working incoming alert
- working replay/acknowledge
- local TTS where available
- clear comments around mock/replaceable offline AI services

Also provide a concise README explaining:

1. How to install dependencies
2. How to run the application
3. How to run the demo
4. Which services are mocked
5. Where real Sherpa-ONNX/offline STT can be integrated
6. Where real Piper/IndicTTS/offline TTS can be integrated
7. Where real Bluetooth/Wi-Fi Direct transport can be integrated

Do not claim that real offline STT, TTS, or P2P is implemented if it is only simulated.

==================================================
29. JUDGE DEMONSTRATION FLOW
==================================================

Optimize the prototype for this short demonstration:

START
↓
Talk screen
↓
Connected to Field Unit 2
↓
Hindi selected
↓
Hold to Talk
↓
"सभी यूनिट अपनी स्थिति की रिपोर्ट करें"
↓
Live Transcript
↓
Processing
↓
Text transmission
↓
Receiver
↓
TTS speaks message
↓
Emergency example
↓
"सभी यूनिट तुरंत सुरक्षित स्थान पर पहुँचें"
↓
Incoming ALERT
↓
PRIORITY ALERT
↓
Speaking Now
↓
ACKNOWLEDGE / REPLAY

The judge should understand the complete idea within a few seconds.

==================================================
30. SOURCE-BASED CONSTRAINTS
==================================================

The project report establishes these core requirements:

- two on-device modules: STT and TTS
- 10 Indian languages
- fully offline operation
- low/mid-range Android target
- Wi-Fi/Bluetooth peer communication
- push-to-talk walkie-talkie mode
- duplex communication mode
- emergency messages with priority audio
- text rather than raw audio as the transmitted payload

The report's architecture is:

MIC → VAD → STT → PACKET → TRANSPORT → PRIORITY → TTS → SPEAKER

The report also specifies three priority classes:

Normal
Important
Emergency

The PPT describes the six major system engines:

1. Voice Front-End + VAD
2. Multilingual STT
3. Text & Priority Layer
4. Transceiver Link
5. Neural TTS
6. Alert & Playback Engine

These concepts should guide the implementation, but DO NOT expose unnecessary technical complexity in the user interface.

==================================================
31. IMPORTANT ARCHITECTURAL RULE
==================================================

The prototype UI is NOT the place to expose the entire ML architecture.

Do not show:
- model parameters
- CTC vs RNN-T
- quantization controls
- model benchmarking
- CPU profiling
- WER graphs
- dataset management
- training controls

Those belong to the technical presentation, not the end-user application.

The mobile application should feel like a simple, reliable field communication tool.

==================================================
32. FINAL QUALITY CHECK
==================================================

Before finishing:

- Remove unused screens.
- Remove unused buttons.
- Remove placeholder lorem ipsum.
- Remove dead navigation.
- Make every visible button perform an action.
- Check light mode.
- Check dark mode.
- Check small screen layouts.
- Check large screen layouts.
- Check PTT interaction.
- Check emergency state.
- Check text readability.
- Check button touch areas.
- Check that no cloud dependency is introduced.
- Check that no extra functionality has been added.

The final result should look like a serious SIH prototype rather than a generic messaging app.

Build the project now.