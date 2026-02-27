/**
 * Image Processing Pipeline for Lamuka Market
 * Simulates server-side processing on the client for preview
 * In production, this runs on the backend (Sharp/Node.js or Intervention/PHP)
 */

// ── 1. QUALITY ANALYSIS ──
export function analyzeImage(file){
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0);

      const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      
      // Average brightness (0-255)
      let totalBright = 0;
      let totalContrast = 0;
      const brightArr = [];
      for(let i=0;i<data.length;i+=4){
        const b = (data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114);
        totalBright += b;
        brightArr.push(b);
      }
      const avgBright = totalBright / (data.length/4);
      
      // Contrast (std deviation of brightness)
      for(let i=0;i<brightArr.length;i++){
        totalContrast += (brightArr[i]-avgBright)**2;
      }
      const contrast = Math.sqrt(totalContrast/brightArr.length);

      // Blur detection (Laplacian variance - simplified)
      const grayCanvas = document.createElement("canvas");
      grayCanvas.width = Math.min(img.width,200);
      grayCanvas.height = Math.min(img.height,200);
      const gctx = grayCanvas.getContext("2d");
      gctx.drawImage(img,0,0,grayCanvas.width,grayCanvas.height);
      const gData = gctx.getImageData(0,0,grayCanvas.width,grayCanvas.height).data;
      
      let laplacian = 0;
      const w = grayCanvas.width;
      for(let y=1;y<grayCanvas.height-1;y++){
        for(let x=1;x<w-1;x++){
          const idx = (y*w+x)*4;
          const center = gData[idx]*4;
          const neighbors = gData[((y-1)*w+x)*4]+gData[((y+1)*w+x)*4]+gData[(y*w+x-1)*4]+gData[(y*w+x+1)*4];
          laplacian += Math.abs(center - neighbors);
        }
      }
      const sharpness = laplacian / ((grayCanvas.width-2)*(grayCanvas.height-2));

      // Quality issues
      const issues = [];
      if(img.width < 500 || img.height < 500) issues.push({type:"size",msg:"Image trop petite (min 500×500px)",severity:"error"});
      if(img.width < 800 || img.height < 800) issues.push({type:"size",msg:"Image petite, qualité réduite sur grand écran",severity:"warn"});
      if(avgBright < 60) issues.push({type:"dark",msg:"Image trop sombre",severity:"error"});
      if(avgBright < 90) issues.push({type:"dark",msg:"Image un peu sombre, essayez d'éclaircir",severity:"warn"});
      if(avgBright > 230) issues.push({type:"bright",msg:"Image surexposée",severity:"warn"});
      if(sharpness < 5) issues.push({type:"blur",msg:"Image floue — rapprochez-vous ou stabilisez",severity:"error"});
      if(sharpness < 10) issues.push({type:"blur",msg:"Image un peu floue",severity:"warn"});
      if(contrast < 20) issues.push({type:"contrast",msg:"Contraste faible — produit peu visible",severity:"warn"});
      if(file.size > 10*1024*1024) issues.push({type:"filesize",msg:"Fichier trop lourd (max 10 MB)",severity:"error"});

      const score = Math.min(100, Math.max(0,
        (avgBright>60&&avgBright<230?25:0) +
        (sharpness>10?25:sharpness>5?15:0) +
        (contrast>30?25:contrast>20?15:0) +
        (img.width>=800&&img.height>=800?25:img.width>=500?15:0)
      ));

      resolve({
        width:img.width, height:img.height,
        brightness:Math.round(avgBright),
        contrast:Math.round(contrast),
        sharpness:Math.round(sharpness*10)/10,
        fileSize:file.size,
        score,
        issues,
        label: score>=80?"Excellente":score>=60?"Bonne":score>=40?"Acceptable":"À améliorer",
        color: score>=80?"#10B981":score>=60?"#6366F1":score>=40?"#F59E0B":"#EF4444",
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

// ── 2. AUTO-ENHANCE ──
export function enhanceImage(file, options={}){
  const {brightness=0, contrast=0, sharpen=false, whiteBalance=false} = options;
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      const canvas = document.createElement("canvas");
      const size = Math.max(img.width,img.height);
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Apply filters
      let filters = [];
      if(brightness) filters.push(`brightness(${1 + brightness/100})`);
      if(contrast) filters.push(`contrast(${1 + contrast/100})`);
      if(sharpen) filters.push(`contrast(1.05)`); // Slight sharpening via contrast
      if(whiteBalance) filters.push(`saturate(1.1)`);
      
      ctx.filter = filters.length ? filters.join(" ") : "none";
      ctx.drawImage(img,0,0);
      
      canvas.toBlob(blob=>{
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width:canvas.width,
          height:canvas.height,
        });
      },"image/jpeg",0.92);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ── 3. SMART CROP (center-weighted) ──
export function cropImage(file, ratio="1:1"){
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      const [rw,rh] = ratio.split(":").map(Number);
      const targetRatio = rw/rh;
      const imgRatio = img.width/img.height;
      
      let sx=0,sy=0,sw=img.width,sh=img.height;
      
      if(imgRatio > targetRatio){
        // Image too wide, crop sides
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        // Image too tall, crop top/bottom
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }

      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx,sy,sw,sh, 0,0,sw,sh);
      
      canvas.toBlob(blob=>{
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width:canvas.width,
          height:canvas.height,
        });
      },"image/jpeg",0.92);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ── 4. RESIZE FOR MULTI-SIZE ──
export function generateVariants(file){
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      const variants = {};
      const sizes = {thumb:200, card:400, full:800};
      const promises = Object.entries(sizes).map(([key,max])=>{
        return new Promise(res=>{
          const scale = Math.min(max/img.width, max/img.height, 1);
          const w = Math.round(img.width*scale);
          const h = Math.round(img.height*scale);
          const canvas = document.createElement("canvas");
          canvas.width=w; canvas.height=h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img,0,0,w,h);
          canvas.toBlob(blob=>{
            variants[key] = {blob, url:URL.createObjectURL(blob), width:w, height:h, size:blob.size};
            res();
          },"image/webp",key==="thumb"?0.8:0.88);
        });
      });
      Promise.all(promises).then(()=>resolve(variants));
    };
    img.src = URL.createObjectURL(file);
  });
}

// ── 5. AUTO-PROCESS PIPELINE ──
export async function processImage(file, options={}){
  const {ratio="1:1", autoEnhance=true} = options;
  
  // Step 1: Analyze
  const analysis = await analyzeImage(file);
  
  // Step 2: Auto-enhance if needed
  let processedFile = file;
  if(autoEnhance){
    const enhancements = {};
    if(analysis.brightness < 100) enhancements.brightness = Math.min(30, 100-analysis.brightness);
    if(analysis.contrast < 30) enhancements.contrast = 15;
    if(analysis.sharpness < 15) enhancements.sharpen = true;
    
    if(Object.keys(enhancements).length > 0){
      const enhanced = await enhanceImage(file, enhancements);
      processedFile = new File([enhanced.blob], file.name, {type:"image/jpeg"});
    }
  }
  
  // Step 3: Crop to ratio
  const cropped = await cropImage(processedFile, ratio);
  const croppedFile = new File([cropped.blob], file.name, {type:"image/jpeg"});
  
  // Step 4: Generate variants
  const variants = await generateVariants(croppedFile);
  
  return {
    analysis,
    preview: cropped.url,
    variants,
    processed: croppedFile,
  };
}
