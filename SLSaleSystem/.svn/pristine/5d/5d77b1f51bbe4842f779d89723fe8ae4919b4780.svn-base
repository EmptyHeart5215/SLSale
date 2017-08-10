package org.slsale.service.function;

import java.util.List;

import javax.annotation.Resource;

import org.slsale.dao.function.FunctionMapper;
import org.slsale.pojo.Authority;
import org.slsale.pojo.Function;
import org.springframework.stereotype.Service;

@Service
public class FunctionServiceImpl implements FunctionService {
	
	@Resource
	private FunctionMapper mapper;
	@Override
	public List<Function> getMainFunctionList(Authority authority)
			throws Exception {
		// TODO Auto-generated method stub
		return mapper.getMainFunctionList(authority);
	}

	@Override
	public List<Function> getSubFunctionList(Function function)
			throws Exception {
		// TODO Auto-generated method stub
		return mapper.getSubFunctionList(function);
	}

}
