// API source
const url = "https://www.instagram.com/la.comedie.humaine/?__a=1"

// DOM targets
const contentZone = document.getElementById('content_zone');
const userProfilePicZone = document.getElementById('user_profile_pic_zone');
const userBioZone = document.getElementById('user_bio_zone');
const imgCollectionZone = document.getElementById('img_collection_zone');

// funcs to fill page
const fillUserProfile = (userInfo, userPicZone, userBioZone) => {
  userPicZone.setAttribute('src', userInfo.profile_pic_url);
  userBioZone.innerHTML = `
    <h3>${userInfo.name}</h3>
    <ul>
      <li>${userInfo.bio}</li>
      <li>${userInfo.followers} followers</li>
    </ul>
  `;
}

const singleImageInfo = (image) => {
  return {
    'src': image.node.thumbnail_resources[1].src,
    'alt': image.node.accessibility_caption,
    'description': `taken on ${stampToDate(image.node.taken_at_timestamp)} 
                    @${image.node.location.name}, 
                    ${image.node.edge_liked_by.count} likes,
                    `
  }
}

const fillImgGallery = (imgCollection, imgZone) => {
  imgCollection.forEach(function(image){
    imgZone.innerHTML += `
      <div class="card col-4" >
        <img class="card-img-top" src="${singleImageInfo(image).src}" alt="${singleImageInfo(image).alt}">
        <div class="card-body">
          <p class="card-text small">${singleImageInfo(image).description}</p>
        </div>
      </div>`
  })
}

// API call
// fetch only works in browser but not in node.js
fetch(url)
.then((response) => (response.json()))
.then((response)=>{
  let coreInfos = response.graphql.user;
  
  // get and fill user info
  let userProfile = {
    'name': coreInfos.full_name,
    'followers': coreInfos.edge_followed_by.count,
    'bio': coreInfos.biography,
    'profile_pic_url': coreInfos.profile_pic_url
  }
  fillUserProfile(userProfile, userProfilePicZone, userBioZone);
  
  // get and fill images
  let imgCollection = coreInfos.edge_owner_to_timeline_media.edges;
  fillImgGallery(imgCollection, imgCollectionZone);
})

// tool functions
const stampToDate= (timestamp) => {
  date = new Date(timestamp * 1000);
  day = date.getDate();
  month = date.getMonth();
  year = date.getFullYear();
  return `${year}/${month}/${day}`
}