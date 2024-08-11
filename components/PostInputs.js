import PinterestPostInput from "./PinterestPostInput";

export default function PostInputs({ setDataForm, platform }) {

    // here you can add more platforms as you grow
    switch(platform) {
      case 'pinterest':
        return <PinterestPostInput setDataForm={setDataForm} />;
      default:
        return null;
    }
    
  
}