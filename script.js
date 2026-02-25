
// Typing Effect - optimized for performance
const text="Senior Email Support & Healthcare Operations Specialist";
let i=0;
function typing(){
  if(i<text.length){
    const element=document.querySelector(".typing");
    if(element)element.innerHTML+=text.charAt(i);
    i++;
    setTimeout(typing,40);
  }
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',typing):typing();

// Certificate Upload Handler
const uploadZone=document.getElementById("uploadZone");
const certificateInput=document.getElementById("certificateInput");
const uploadedFilesList=document.getElementById("uploadedFiles");
const submitCertificatesBtn=document.getElementById("submitCertificates");
let uploadedFiles=[];

const allowedFormats={pdf:{ext:"PDF",icon:"📄"},docx:{ext:"DOCX",icon:"📋"},doc:{ext:"DOC",icon:"📋"},xls:{ext:"XLS",icon:"📊"},xlsx:{ext:"XLSX",icon:"📊"},jpg:{ext:"JPG",icon:"🖼"},png:{ext:"PNG",icon:"🖼"}};

function handleFiles(files){
  Array.from(files).forEach(file=>{
    const ext=file.name.split(".").pop().toLowerCase();
    if(allowedFormats[ext]&&file.size<=10*1024*1024){
      if(!uploadedFiles.find(f=>f.name===file.name&&f.size===file.size)){
        uploadedFiles.push({name:file.name,size:file.size,ext:ext,file:file});
        displayUploadedFiles();
      }
    }else{
      alert(`File "${file.name}" is either not supported or exceeds 10MB limit`);
    }
  });
}

function displayUploadedFiles(){
  uploadedFilesList.innerHTML=uploadedFiles.map((f,i)=>`
    <div class="uploaded-file-item">
      <span>${allowedFormats[f.ext].icon} ${f.name}</span>
      <span style="color:#94a3b8; font-size:12px;">${(f.size/1024).toFixed(1)}KB</span>
      <button type="button" onclick="removeFile(${i})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:18px; padding:0;">×</button>
    </div>
  `).join("");
  submitCertificatesBtn.style.display=uploadedFiles.length>0?"block":"none";
}

function removeFile(index){
  uploadedFiles.splice(index,1);
  displayUploadedFiles();
}

if(uploadZone){
  uploadZone.addEventListener("click",()=>certificateInput.click());
  uploadZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    uploadZone.style.background="rgba(20,184,166,0.1)";
    uploadZone.style.borderColor="#14b8a6";
  });
  uploadZone.addEventListener("dragleave",()=>{
    uploadZone.style.background="";
    uploadZone.style.borderColor="";
  });
  uploadZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    uploadZone.style.background="";
    uploadZone.style.borderColor="";
    handleFiles(e.dataTransfer.files);
  });
}

if(certificateInput){
  certificateInput.addEventListener("change",(e)=>handleFiles(e.target.files));
}

if(submitCertificatesBtn){
  submitCertificatesBtn.addEventListener("click",async()=>{
    submitCertificatesBtn.disabled=true;
    submitCertificatesBtn.textContent="Preparing files...";
    const formData=new FormData();
    formData.append("subject","Certificate Upload");
    formData.append("message",`Certificates submitted for review:\n${uploadedFiles.map(f=>`- ${f.name} (${(f.size/1024).toFixed(1)}KB)`).join("\n")}`);
    uploadedFiles.forEach(f=>formData.append("certificates",f.file));
    try{
      const response=await fetch("https://formspree.io/f/xbdaqbbq",{method:"POST",body:formData});
      if(response.ok){
        submitCertificatesBtn.textContent="✓ Files Sent Successfully!";
        submitCertificatesBtn.style.background="#10b981";
        uploadedFiles=[];
        displayUploadedFiles();
        setTimeout(()=>{
          submitCertificatesBtn.textContent="Send Certificates to Email";
          submitCertificatesBtn.style.background="";
          submitCertificatesBtn.disabled=false;
        },3000);
      }else{
        submitCertificatesBtn.textContent="Error sending files - Try again";
        submitCertificatesBtn.disabled=false;
      }
    }catch(err){
      submitCertificatesBtn.textContent="Connection error - Try again";
      submitCertificatesBtn.disabled=false;
    }
  });
}

// About Me Modal
const modal=document.getElementById("aboutMeModal");
const aboutMeBtn=document.getElementById("aboutMeBtn");
const closeBtn=document.querySelector(".close");

aboutMeBtn?.addEventListener("click",()=>modal.style.display="block");
closeBtn?.addEventListener("click",()=>modal.style.display="none");
window.addEventListener("click",(e)=>e.target===modal&&(modal.style.display="none"));

// Case Study Toggle - delegated event handling
document.addEventListener("click",(e)=>{
  const caseItem=e.target.closest(".case");
  if(caseItem){
    const content=caseItem.querySelector(".case-content");
    if(content)content.style.display=content.style.display==="block"?"none":"block";
  }
});

// Contact Form Handler
const contactForm=document.querySelector(".contact-form");
if(contactForm){
  const submitBtn=contactForm.querySelector('button[type="submit"]');
  contactForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const originalText=submitBtn.textContent;
    submitBtn.disabled=true;
    submitBtn.textContent="Sending...";
    
    const formData=new FormData(contactForm);
    try{
      const response=await fetch(contactForm.action,{
        method:"POST",
        body:formData,
        headers:{"Accept":"application/json"}
      });
      
      if(response.ok){
        submitBtn.textContent="✓ Message Sent Successfully!";
        submitBtn.style.background="#10b981";
        contactForm.reset();
        setTimeout(()=>{
          submitBtn.textContent=originalText;
          submitBtn.style.background="";
          submitBtn.disabled=false;
        },3000);
      }else{
        submitBtn.textContent="Error sending message";
        submitBtn.disabled=false;
      }
    }catch(err){
      submitBtn.textContent="Connection error - Try again";
      submitBtn.disabled=false;
    }
  });
}
