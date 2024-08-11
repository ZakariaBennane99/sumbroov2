const reqs = {
    instagram: {
        image: [
            "File size should not exceed 8MB.",
            "File type must be JPEG.",
            "Aspect ratio: Must be within a 1.91:1 to 4:5 range.",
            "Minimum width: 320px.",
            "Maximum width: 1440px."
        ],
        video: [
            "Container: MOV or MP4 (MPEG-4 Part 14), no edit lists, moov atom at the front of the file.",
            "Audio codec: AAC, 48khz sample rate maximum, 1 or 2 channels (mono or stereo).",
            "Video codec: HEVC or H264, progressive scan, closed GOP, 4:2:0 chroma subsampling.",
            "Frame rate: 23-60 FPS.",
            "Maximum columns (horizontal pixels): 1920px.",
            "Minimum aspect ratio [cols / rows]: 4 / 5.",
            "Maximum aspect ratio [cols / rows]: 16 / 9.",
            "Video bitrate: VBR, 25Mbps maximum.",
            "Audio bitrate: 128kbps.",
            "Duration: 60 seconds maximum, 3 seconds minimum.",
            "File size: 100MB maximum."
        ]
    },
    facebook: {
        image: [
            "File size should not exceed 4MB.",
            "File type should be of the following formats: JPEG, BMP, PNG, GIF, or TIFF.",
            "Aspect ratio: Must be within a 1.91:1 to 4:5 range."
        ],
        video: [
            "Container: MOV or MP4 format.",
            "Audio codec: AAC (Advanced Audio Codec).",
            "Video codec: H.264 (MPEG-4 AVC).",
            "Frame rate: 25-60 FPS.",
            "Aspect ratio: 16:9 (landscape) to 9:16 (portrait).",
            "Maximum horizontal pixels: 4000px wide and divisible by 16.",
            "Video bitrate: Up to 45Mbps for 4K videos.",
            "Audio bitrate: 128kbps.",
            "Duration: 4 Hour max.",
            "File size: 1GB maximum."
        ]
    },
    pinterest: {
        image: [
            "File size should not exceed 20MB.",
            "File type should be of the following formats: BMP, .JPEG, .PNG, .TIFF, .WEBP.",
            "Aspect ratio: 2:3 or 9:16.",
            "Resoultion: 1000px wide X 1500px tall (or larger).",
            "Ensure your text content is visible on all devices by positioning it at least 65px left, 195px right, 270px top, and 790px bottom."
        ], 
        video: [
            "File size: 2GB maximum.",
            "File type: .MP4, .M4V.",
            "Aspect ratio: 9:16 or 2:3. Videos should take up the entire screen (No margins).",  
            "Resolution: 540px wide X 960px tall (or larger).",
            "Video codec: H.264 or H.265.",
            "Duration: Minimum 4 seconds, maximum 5 minutes.",
            "Ensure your text content is visible on all devices by positioning it at least 65px left, 195px right, 270px top, and 790px bottom." 
        ]
    },
    Twitter: {
        image: [

        ], 
        video: [

        ]
    }
}

export default reqs
