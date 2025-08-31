# Backend Photo Management API Specifications

## Overview
This document outlines the backend APIs needed to support photo upload, management, and display functionality for the dating app.

## Required API Endpoints

### 1. Upload Photos
**Endpoint:** `POST /profile/upload-photos`
**Description:** Upload multiple photos for a user's profile

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Authentication: Required (JWT token in cookies)
- Body: FormData with 'photos' field containing image files

**Response:**
```json
{
  "success": true,
  "message": "Photos uploaded successfully",
  "uploadedPhotos": [
    {
      "filename": "photo1.jpg",
      "url": "/uploads/user123/photo1.jpg",
      "size": 1024000
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to upload photos",
  "error": "File size too large"
}
```

### 2. Delete Photo
**Endpoint:** `DELETE /profile/delete-photo`
**Description:** Delete a specific photo from user's profile

**Request:**
- Method: DELETE
- Content-Type: application/json
- Authentication: Required (JWT token in cookies)
- Body:
```json
{
  "photoIndex": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

### 3. Set Main Photo
**Endpoint:** `PUT /profile/set-main-photo`
**Description:** Set a photo as the main profile photo

**Request:**
- Method: PUT
- Content-Type: application/json
- Authentication: Required (JWT token in cookies)
- Body:
```json
{
  "photoIndex": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Main photo updated successfully",
  "newMainPhoto": "/uploads/user123/photo2.jpg"
}
```

### 4. Get User Photos
**Endpoint:** `GET /profile/photos`
**Description:** Get all photos for a user

**Request:**
- Method: GET
- Authentication: Required (JWT token in cookies)

**Response:**
```json
{
  "success": true,
  "photos": [
    {
      "url": "/uploads/user123/main.jpg",
      "isMain": true,
      "uploadedAt": "2025-01-01T00:00:00Z"
    },
    {
      "url": "/uploads/user123/photo1.jpg",
      "isMain": false,
      "uploadedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## Database Schema Updates

### User Model Updates
```javascript
// Add to existing User schema
{
  photoUrl: {
    type: String,
    default: ""
  },
  photos: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }]
}
```

## File Storage Requirements

### 1. File Upload Directory
- Create `/uploads/` directory in your backend
- Organize by user ID: `/uploads/{userId}/`
- Support multiple image formats: JPG, PNG, GIF, WebP

### 2. File Size Limits
- Maximum file size: 5MB per photo
- Maximum photos per user: 5 photos
- Supported formats: image/jpeg, image/png, image/gif, image/webp

### 3. Image Processing
- Resize images to reasonable dimensions (e.g., 800x800 max)
- Generate thumbnails for faster loading
- Optimize image quality for web

## Security Considerations

### 1. File Validation
- Validate file types using MIME type checking
- Scan for malicious content
- Prevent path traversal attacks

### 2. Access Control
- Only authenticated users can upload/delete their own photos
- Validate user ownership before any photo operations
- Implement rate limiting for uploads

### 3. File Naming
- Use unique, secure filenames (UUID + timestamp)
- Avoid predictable file paths
- Sanitize original filenames

## Implementation Notes

### 1. Error Handling
- Handle file system errors gracefully
- Provide meaningful error messages
- Log upload/delete operations for debugging

### 2. Performance
- Use streaming for large file uploads
- Implement proper cleanup of temporary files
- Consider CDN integration for better performance

### 3. Backup Strategy
- Implement regular backups of uploaded files
- Consider cloud storage (AWS S3, Google Cloud Storage) for production

## Example Implementation (Node.js/Express)

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id;
    const uploadPath = `uploads/${userId}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload photos endpoint
app.post('/profile/upload-photos', authenticateToken, upload.array('photos', 5), async (req, res) => {
  try {
    const userId = req.user._id;
    const uploadedFiles = req.files;
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    // Save file information to database
    const photoUrls = uploadedFiles.map(file => ({
      url: `/uploads/${userId}/${file.filename}`,
      filename: file.filename,
      uploadedAt: new Date(),
      isMain: false
    }));
    
    // Update user's photos array
    await User.findByIdAndUpdate(userId, {
      $push: { photos: { $each: photoUrls } }
    });
    
    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      uploadedPhotos: photoUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});
```

## Testing Checklist

- [ ] Upload single photo
- [ ] Upload multiple photos
- [ ] Delete photo
- [ ] Set main photo
- [ ] Handle invalid file types
- [ ] Handle oversized files
- [ ] Handle unauthorized access
- [ ] Handle missing files
- [ ] Test photo display in frontend
- [ ] Test error scenarios

## Frontend Integration Notes

The frontend is already configured to work with these endpoints. Key features:

1. **Photo Upload**: Drag & drop or click to upload
2. **Photo Management**: Hover to see delete/set main options
3. **Error Handling**: Fallback to default avatar on load errors
4. **Loading States**: Visual feedback during uploads
5. **Responsive Design**: Works on mobile and desktop

## Next Steps

1. Implement the backend APIs as specified
2. Set up file storage directory structure
3. Configure proper CORS for file serving
4. Test all endpoints with the frontend
5. Deploy and monitor for any issues
