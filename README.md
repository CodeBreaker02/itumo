# itumo

itumo is a subtitle app designed to subtitle English videos in Yoruba. The application leverages AWS Transcribe for transcription, Google Cloud Translate for translation, and FFmpeg for video editing.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (v18 or later)
- pnpm (Package manager)
- AWS Account with access to Transcribe and S3
- Google Cloud Account with access to Translate API
- FFmpeg

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/CodeBreaker02/itumo.git
   cd itumo
   ```

2. Install dependencies using pnpm:

   ```sh
   pnpm install
   ```

3. Set up Husky:
   ```sh
   pnpm prepare
   ```

### Usage

1. Create a `.env` file in the root directory and add your environment variables:

   ```env
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_BUCKET_NAME=your_aws_s3_bucket_name
   AWS_REGION=your_aws_region
   NEXT_PUBLIC_AWS_S3_BASE_URL=your_aws_s3_base_url
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
   ```

2. Start the development server:

   ```sh
   pnpm dev
   ```

3. Build the project:

   ```sh
   pnpm build
   ```

4. Start the production server:
   ```sh
   pnpm start
   ```

### Scripts

- `pnpm preinstall`: Ensures pnpm is used as the package manager.
- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the project for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs linting checks.
- `pnpm prepare`: Sets up Husky for Git hooks.

### Environment Variables

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AWS_BUCKET_NAME`: Your AWS S3 bucket name.
- `AWS_REGION`: The AWS region for your S3 bucket.
- `NEXT_PUBLIC_AWS_S3_BASE_URL`: Base URL for your S3 bucket.
- `GOOGLE_TRANSLATE_API_KEY`: Your Google Translate API key.

### Technologies Used

- **Next.js:** Framework for building server-side rendering and static web applications using React.
- **AWS Transcribe:** For converting speech in English videos to text.
- **Google Cloud Translate:** For translating the transcribed text from English to Yoruba.
- **FFmpeg:** For embedding the translated subtitles back into the video.
- **Tailwind CSS:** For styling the application.
- **Husky & lint-staged:** For managing Git hooks and ensuring code quality.
- **TypeScript:** For type safety and better developer experience.

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
