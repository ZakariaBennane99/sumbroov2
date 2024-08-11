/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Select from 'react-select';
import { useState, useEffect } from "react";


const capitalize = (string) => {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Targeting = ({ nichesAndTags, errors, chosenNicheAndTags, resetErrors, platform, setPublishPost }) => {

  const options = nichesAndTags.map(el => {
    return {
      value: el.niche, label: capitalize(el.niche)
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [targetField, setTargetField] = useState(null);
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (Object.values(errors).some(value => Boolean(value))) {
      setIsOpen(true)
    }
  }, [errors])

  useEffect(() => {
    chosenNicheAndTags({
      niche: targetField, 
      tags: tags
    })
  }, [targetField, tags]);

  const selectedStyle = {
    backgroundColor: '#8383a4',
    color: 'white'
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  function handleFieldChange(selectedOption) {
    setPublishPost(false)
    resetErrors(prev => {
      return {
        ...prev,
        niche: null
      }
    })
    setTags([])
    console.log('The selected option', selectedOption)
    setTargetField(selectedOption)
  }

  function handleTags(e) {
    setPublishPost(false)
    resetErrors(prev => {
      return {
        ...prev,
        audience: null
      }
    })
    const tag = e.target.dataset.value
    const isInTags = tags.includes(tag)
    if (!isInTags) {
      setTags(prev => [
        ...prev,
        tag
      ])
    } else {
      const index = tags.indexOf(tag)
      if (index !== -1) {
        setTags(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      }
    }
  }

  const renderTags = () => {

    const target = nichesAndTags.find(el => el.niche === targetField.value);

    return ( <>
      { target.tags.map((el, i) => {
        return (<span 
          key={i}
          data-value={el} 
          onClick={handleTags} 
          style={tags.includes(el) ? selectedStyle : {}}
        >
          {capitalize(el)}
        </span>)
      }) }
    </>);
  };

  // for the tooltip
  const [style, setStyle] = useState({
    visibility: 'hidden'
  })
  function handleWarning() {
    setStyle({
        visibility: 'visible'
    })
    setTimeout(() => {
        setStyle({
            visibility: 'hidden'
        })
    }, 1000)
  }


  if (platform) {
    return (<div className='requirementsDiv'>
    <div className='reqsTitle' onClick={toggleAccordion}>
        <div>
            <h1>4/ Audience Targeting</h1>
        </div>
        <div>
            <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
        </div>
    </div>
      {isOpen && <div className='targetingBodyContainer'>
        <ul>
          <li>After selecting the field, you can refine your audience selection based on specific interests. A range of tags or subfields will appear, enabling you to target more precisely.</li>
          <li>Each post permits targeting of one specific audience segment.</li>
          <li>Select an audience that closely aligns with both your account theme and the content of the post.</li>
        </ul>
        <div className='target-audience-wrapper'>
          {errors.niche ? <p style={{ fontSize: '.8em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>{errors.niche}</p> : '' }
          <Select
            value={targetField}
            onChange={handleFieldChange}
            options={options}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: '#e8e8ee',  // color of the option when hovering
                primary: '#a4a4bb',  // color of the selected option
              },
            })}
            styles={{
              option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? 'white' : '#1c1c57',
              }),
              singleValue: (provided) => {
                  const color = '#1c1c57';
                  return { ...provided, color };
              },
              control: (provided) => ({
                ...provided,
                borderColor: errors.niche ? 'red' : provided.borderColor, // If there&apos;s an error, set border color to red
                boxShadow: errors.niche ? '0 0 0 1px red' : provided.boxShadow, // If there&apos;s an error, set boxShadow to red
              })
            }}
            placeholder='Select Your Target Niche'
          />

        </div>
          {
            targetField ? (
              <>
                <div className="sub-fields-wrapper">
                  {renderTags()}
                </div>
                {errors.audience ? (
                  <p
                    style={{
                      fontSize: '.8em',
                      marginBottom: '10px',
                      marginTop: '0px',
                      marginLeft: '10px',
                      color: 'red',
                    }}
                  >
                    {errors.audience}
                  </p>
                ) : null}
              </>
            ) : null
          }
        </div>}
      </div>)
  } else {
    return (<div className='requirementsDiv'>
      <div className='reqsTitle' onClick={handleWarning}>
          <div>
              <h1>4/ Audience Targeting</h1>
              <div className='reqsTooltip' style={style}>Please select a platform first!</div>
          </div>
          <div>
              <img src='/arrow.svg' style={{ transform: 'rotate(180deg)' }} />
          </div>
      </div>
    </div>)
  }

};

export default Targeting;
