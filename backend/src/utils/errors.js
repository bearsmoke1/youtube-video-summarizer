// Typed errors → each maps to an HTTP status + a user-friendly message.
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Please enter a valid YouTube video URL.') {
    super(message, 400);
  }
}

export class NoCaptionsError extends AppError {
  constructor(message = "This video has no captions, so it can't be summarized.") {
    super(message, 422);
  }
}

export class TranscriptError extends AppError {
  constructor(message = "Couldn't fetch the transcript. Try another video.") {
    super(message, 502);
  }
}

export class LLMError extends AppError {
  constructor(message = 'The summarizer is unavailable right now. Please try again.') {
    super(message, 502);
  }
}
