const reviewsData = [
    {
      id: 1,
      userImage:require('../assets/rectangle-371.jpg') ,
      userName: 'Wyeth Obrero',
      ratingStar: 5,
      reviewText: 'Excellent service! Magbook na kayo mga bhiee!',
      reviewImages: [
        require('../assets/review1.jpg'),
        require('../assets/review2.jpg'),
        require('../assets/review3.jpg'),
      ],
      date: '2024-03-26',
      time: '10:00 AM',
    },
    {
      id: 2,
      userImage: require('../assets/rectangle-370.jpg'),
      userName: 'Darmae Tan',
      ratingStar: 5,
      reviewText: 'Excellent service! Highly recommended.',
      reviewImages: [
        
      ],
      date: '2024-03-25',
      time: '11:30 AM',
    },
    {
      id: 3,
      userImage: require('../assets/rectangle-372.jpg'),
      userName: 'Alexis Padolina',
      ratingStar: 4.5,
      reviewText: "Great service! Really satisfied with my ate's look.",
      reviewImages: [
        require('../assets/review5.jpg'),
        require('../assets/review6.jpg'),
  
      ],
      date: '2024-03-26',
      time: '10:00 AM',
    },
    
    {
      id: 4,
      userImage: require('../assets/rectangle-374.jpg'),
      userName: 'John Dico',
      ratingStar: 5,
      reviewText: 'Great service! Really satisfied with my booking.',
      reviewImages: [
  
        
      ],
      date: '2024-03-25',
      time: '11:30 AM',
    },
    {
      id: 5,
      userImage: require('../assets/image-14.png'),
      userName: 'Wyndel Asoy',
      ratingStar: 3.5,
      reviewText: '',
      reviewImages: [
        require('../assets/review4.jpg'),
      ],
      date: '2024-03-24',
      time: '09:45 AM',
    },
    
    {
      id: 6,
      userImage: require('../assets/rectangle-372.jpg'),
      userName: 'Alexis Padolina',
      ratingStar: 4.5,
      reviewText: 'Good service. Could be better.',
      reviewImages: [
        
      ],
      date: '2024-03-24',
      time: '09:45 AM',
    },
    
    
  ];

  const postsData = [
    {
      id: 1,
      postImages: [
          require('../assets/post2.jpg'),
        ],
      postText: 'Wasn’t able to upload this gem but this is one of my favorite makeup looks. We did this glam early in the morning so I’m making sure this look will last the whole day. I’m glad this look turned exactly how the client wants it despite asking me to do whatever I want with her glam. It is indeed a hidden spark between me and my clients. I wish I can meet someone like her in the future.',
      date: '2024-03-13',
      time: '10:30 AM',
    },
    {
      id: 2,
      postImages:  [
          require('../assets/post3.jpg'),
          require('../assets/post4.jpg'),
          require('../assets/post5.jpg'),
        ],
      postText: 'Had fun glamming youu',
      date: '2024-03-15',
      time: '12:45 PM',
    },
  ];

  export { reviewsData, postsData };