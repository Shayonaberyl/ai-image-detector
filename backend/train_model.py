import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

print("Starting training...")

# Step 1 - Prepare images
# This reads images from folders and prepares them for training
# rescale makes pixel values go from 0-255 to 0-1 (easier for AI to learn)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(
    rescale=1./255
)

# Step 2 - Load images from folders
# It automatically uses folder names (ai/real) as labels
train_data = train_datagen.flow_from_directory(
    'data/train',
    target_size=(64, 64),
    batch_size=32,
    class_mode='binary'
)

val_data = val_datagen.flow_from_directory(
    'data/val',
    target_size=(64, 64),
    batch_size=32,
    class_mode='binary'
)

print("Images loaded successfully!")

# Step 3 - Load MobileNetV2 (pretrained AI)
# This AI already knows how to see shapes, edges, patterns
# We just teach it the difference between AI and Real images
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(64, 64, 3)
)

# Freeze the base - dont change what it already learned
base_model.trainable = False

# Step 4 - Add our custom layer on top
# This is the part that learns AI vs Real
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=output)

# Step 5 - Compile the model
# adam = smart optimizer that adjusts learning speed automatically
# binary_crossentropy = measures how wrong the AI is each time
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("Model ready! Starting training now...")
print("This will take 10-20 minutes, please wait...")

# Step 6 - Train the model!
# epochs=10 means it will look at ALL images 10 times
history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=10
)

# Step 7 - Save the trained model
model.save('model/detector.h5')
print("Model saved successfully!")
print("Training complete!")

# Step 8 - Show final accuracy
final_accuracy = history.history['accuracy'][-1] * 100
val_accuracy = history.history['val_accuracy'][-1] * 100
print(f"Training Accuracy: {final_accuracy:.2f}%")
print(f"Validation Accuracy: {val_accuracy:.2f}%")