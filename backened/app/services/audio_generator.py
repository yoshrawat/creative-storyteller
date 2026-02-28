from google.cloud import texttospeech
import base64
from app.config import settings

# Initialize the async client
client = texttospeech.TextToSpeechAsyncClient()

async def generate_audio_base64(text: str) -> str:
    try:
        # Set the text input to be synthesized
        synthesis_input = texttospeech.SynthesisInput(text=text)

        # Build the voice request, select the language code ("en-US") and the ssml
        # voice gender ("neutral")
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", 
            name="en-US-Neural2-F"
        )

        # Select the type of audio file you want returned
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        # Perform the text-to-speech request on the text input with the selected
        # voice parameters and audio file type
        response = await client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        print(f"Generated audio for text of length: {len(text)}, size: {len(response.audio_content)} bytes")
        return base64.b64encode(response.audio_content).decode("utf-8")
    except Exception as e:
        print(f"Error generating audio: {e}")
        return ""
