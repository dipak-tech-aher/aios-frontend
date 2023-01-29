export function getProp(object, keys, defaultVal) {
    keys = Array.isArray(keys) ? keys : keys.split('.')
    object = object[keys[0]]
    if (object && keys.length > 1) {
        return getProp(object, keys.slice(1), defaultVal)
    }
    return object ? object : defaultVal
}

export function customSort(collection = [], columnName, sortingOrder) {
    let sort1 = -1, sort2 = 1;
    const isAscendingSort = sortingOrder[columnName]
    if (isAscendingSort === false) {
        sort1 = 1;
        sort2 = -1;
    }
    return collection.sort(function (val1, val2) {
        let value1 = getProp(val1, columnName, '');
        let value2 = getProp(val2, columnName, '');
        // check for date data type
        if (typeof value1 !== "number") {
            value1 = value1 ? value1.toLowerCase() : value1
            value2 = value2 ? value2.toLowerCase() : value2
            if (value1 === value2) {
                return 0;
            }
        } else {
            if (value1 === value2) {
                return 0;
            }
        }
        return value1 < value2 ? sort1 : sort2;
    })
}

export const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data))
}
export const constructSortingData = function (sortingOrder, column, defaultValue) {
    const response = deepClone(sortingOrder)
    for (const key in response) {
        if (response.hasOwnProperty(key)) {
            if (key === column) {
                if (response[column] === true || response[column] === false) {
                    response[column] = defaultValue || !response[column]
                } else {
                    response[column] = true
                }
            } else {
                response[key] = ""
            }
        }
    }
    return response
}

export const genderOptions = [
    {
        label: 'Male',
        value: 'M'
    }, {
        label: 'Female',
        value: 'M'
    }, {
        label: 'Other',
        value: 'other'
    }, {
        label: 'Unknown',
        value: 'unknown'
    },
]

export const getDisplayOptionForGender = (value) => {
    const displayOption = genderOptions.find((gender) => {
        return gender.value === value
    })
    return displayOption ? displayOption.label : ""
}

export const formFilterObject = (filters) => {
    return filters.map((filter) => {
        const { id, value } = filter;
        return {
            id,
            value: value[0],
            filter: value[1]
        }
    })
}

export const filterLookupBasedOnType = (lookup, mappingValue, mappingKey) => {
    return lookup.filter((data) => {
        let isTrue = false;
        if (data.mapping && data.mapping.hasOwnProperty(mappingKey) && data.mapping[mappingKey].includes(mappingValue)) {
            return isTrue = true;
        }
        return isTrue;
    })
}

export const getServiceCategoryMappingBasedOnProdType = (prodTypeLookupdate, serviceType) => {
    return prodTypeLookupdate.find((type) => type.code === serviceType).mapping;
}