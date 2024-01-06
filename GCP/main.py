from google.cloud import storage
import tensorflow as tf
from PIL import Image
import numpy as np 

BUCKET_NAME = "kalana-tomato-model"

class_names = ['Tomato_Leaf_Mold', 'Tomato__Target_Spot', 'Tomato_healthy']

model = None

def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

def predict(request):
    global model
    if model is None:
        download_blob(
        BUCKET_NAME,
        "models/tomatoes.h5", #path to the model in the bucket
        "/tmp/tomatoes.h5", #path to store the loaded model temperory
        )
        model = tf.keras.models.load_model("/tmp/tomatoes.h5")
    image = request.files["file"]

    image = np.array(Image.open(image).convert("RGB").resize((256,256)))
    image = image/255

    img_array = tf.expand_dims(image, 0)

    predictions =  model.predict(img_array)
    print(predictions)

    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100*(np.max(predictions[0])), 2)

    return {"class_name": predicted_class, "confidance": confidence}


# from flask import Flask, request, jsonify
# from flask_cors import CORS  # Import the CORS class
# from google.cloud import storage
# import tensorflow as tf
# from PIL import Image
# import numpy as np 

# BUCKET_NAME = "kalana-tomato-model"
# class_names = ['Tomato_Leaf_Mold', 'Tomato__Target_Spot', 'Tomato_healthy']

# model = None

# def download_blob(bucket_name, source_blob_name, destination_file_name):
#     storage_client = storage.Client()
#     bucket = storage_client.get_bucket(bucket_name)
#     blob = bucket.blob(source_blob_name)
#     blob.download_to_filename(destination_file_name)

# def create_app():
#     app = Flask(__name__)
#     CORS(app)  # Add CORS support to your Flask app

#     @app.route('/predict', methods=['POST'])
#     def predict():
#         global model
#         if model is None:
#             download_blob(
#                 BUCKET_NAME,
#                 "models/tomatoes.h5", #path to the model in the bucket
#                 "/tmp/tomatoes.h5", #path to store the loaded model temporarily
#             )
#             model = tf.keras.models.load_model("/tmp/tomatoes.h5")

#         image = request.files["file"]

#         image = np.array(Image.open(image).convert("RGB").resize((256,256)))
#         image = image/255

#         img_array = tf.expand_dims(image, 0)

#         predictions =  model.predict(img_array)
#         print(predictions)

#         predicted_class = class_names[np.argmax(predictions[0])]
#         confidence = round(100*(np.max(predictions[0])), 2)

#         return jsonify({"class_name": predicted_class, "confidence": confidence})

#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(port=8080, debug=True)
