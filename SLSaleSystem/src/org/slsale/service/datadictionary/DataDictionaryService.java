package org.slsale.service.datadictionary;

import java.util.List;

import org.slsale.pojo.DataDictionary;

public interface DataDictionaryService {
	/**
	 * getDataDictionaries
	 * @param dataDictionary
	 * @return
	 * @throws Exception
	 */
	public List<DataDictionary> getDataDictionaries(DataDictionary dataDictionary)throws Exception;
}