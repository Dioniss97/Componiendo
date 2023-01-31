const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const db = require("../models");
const ImageOriginal = db.ImageOriginal;
const ImageConfiguration = db.ImageConfiguration;
const ImageResize = db.ImageResize;

module.exports = class ImageService {

    constructor(entity, entityId) {
        this.entity = entity;
        this.entityId = entityId;
    }

    uploadImage = async images => {

        for (let key in images) {

            for(let image of images[key]) {

                try{
                    if(image.fieldname.includes('[]')){
                        image.fieldname = image.fieldname.replace('[]', '');
                    }
                    
                    let oldPath = path.join(__dirname, `../storage/tmp/${image.originalname}`);
                    let newPath = path.join(__dirname, `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/original/${image.originalname}`);    
                    let newDir = path.dirname(newPath);

                    await fs.mkdir(newDir, { recursive: true }, async err => {
    
                        if (err) throw err;
    
                        await fs.rename(oldPath, newPath, (err) => {
                            if (err) throw err;
                        });
        
                        let metadata =  await sharp(newPath).metadata();
        
                        const imageOriginal = await ImageOriginal.create({
                            path: `/storage/images/${this.entity}/${this.entityId}/${image.fieldname}/original/${image.originalname}`,
                            entity: this.entity,
                            entityId: this.entityId,
                            languageAlias: 'es',
                            filename: image.originalname,
                            content: image.fieldname,
                            mimeType: image.mimetype,
                            sizeBytes: image.size,
                            widthPx: metadata.width,
                            heightPx: metadata.height
                        });
                        
                        if (!fs.existsSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/thumbnail`))){
                            fs.mkdirSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/thumbnail`));	
                        }
        
                        if (!fs.existsSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/mobile`))){
                            fs.mkdirSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/mobile`));	
                        }
        
                        if (!fs.existsSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/desktop`))){
                            fs.mkdirSync(path.join(__dirname,  `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/desktop`));	
                        }
        
                        const imageConfigurations =  await ImageConfiguration.findAll({
                            where: {
                                entity: this.entity,
                                content: image.fieldname
                            }
                        });
        
                        for (let imageConfiguration of imageConfigurations) {
        
                            const imageResize = await sharp(newPath)
                                .resize(imageConfiguration.widthPx, imageConfiguration.heightPx)
                                .toFormat(imageConfiguration.extensionConversion, { quality: imageConfiguration.quality })
                                .toFile(path.join(__dirname, `../storage/images/${this.entity}/${this.entityId}/${image.fieldname}/${imageConfiguration.grid}/${path.parse(image.filename).name}.${imageConfiguration.extensionConversion}`));
        
                            await ImageResize.create({
                                imageConfigurationId: imageConfiguration.id,
                                imageOriginalId: imageOriginal.id,
                                title: "prueba",
                                alt: "prueba",
                                path: `/storage/images/${this.entity}/${this.entityId}/${image.fieldname}/${imageConfiguration.grid}/${path.parse(image.filename).name}.${imageConfiguration.extensionConversion}`,
                                entity: this.entity,
                                entityId: this.entityId,
                                languageAlias: 'es',
                                filename: image.originalname,
                                content: image.fieldname,
                                mimeType: `image/${imageResize.format}`,
                                grid: imageConfiguration.grid,
                                sizeBytes: imageResize.size,
                                widthPx: imageConfiguration.widthPx,
                                heightPx: imageConfiguration.heightPx,
                                quality: imageConfiguration.quality
                            });     
                        } 
                    }); 
                } catch (error) {
                    console.log(error);
                }    
            }
        }
    }

    getImages = async () => {

        const images = await ImageResize.findAll({
            where: {
                entity: this.entity,
                entityId: this.entityId
            }
        });

        return images;
    }
}