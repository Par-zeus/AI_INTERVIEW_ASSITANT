import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

def predict_emotion(image_path):
    # Load the trained model
    model = load_model("best_model.h5")

    # Load image, convert to grayscale and resize to 48x48
    image = Image.open(image_path).convert("L")
    image = image.resize((48, 48))

    # Convert image to numpy array and normalize
    img_array = np.array(image) / 255.0

    # Reshape for model input: (1, 48, 48, 1)
    img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension
    img_array = np.expand_dims(img_array, axis=0)   # Add batch dimension

    # Predict emotion
    prediction = model.predict(img_array)
    emotion_idx = np.argmax(prediction)

    # Optional: map index to emotion label
    emotion_labels = ['anger', 'neutral', 'fear', 'sad', 'disgust', 'happy', 'surprise']
    emotion = emotion_labels[emotion_idx]

    print(f"\n\nPredicted Emotion: {emotion}")

# Call the function on the uploaded image
predict_emotion("surprise.jpg")